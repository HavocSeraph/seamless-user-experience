import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Role } from '@prisma/client';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly ledgerService: LedgerService
  ) {}

  async getStats() {
    const [totalUsers, activeSessions, totalEscrow, totalDisputes] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.session.count({ where: { status: 'ACTIVE' } }),
      this.prisma.escrow.aggregate({ _sum: { amount: true }, where: { status: { in: ['LOCKED', 'DISPUTED'] } } }),
      this.prisma.dispute.count()
    ]);

    // Use SCAN with sets from presence to estimate online users
    // This is simplified, just counting presence:* keys to comply with rule using scan
    let onlineUsers = 0;
    try {
      let cursor = '0';
      do {
        const result = await this.redisService.pubClient.scan(cursor, 'MATCH', 'presence:*', 'COUNT', 100);
        cursor = result[0];
        onlineUsers += result[1].length;
      } while (cursor !== '0');
    } catch (err) {
      this.logger.error('Failed to get online users via SCAN', err);
    }

    return {
      totalUsers,
      activeSessions,
      lockedEscrow: totalEscrow._sum.amount || 0,
      totalDisputes,
      dailyActiveUsers: onlineUsers // mock or dynamic
    };
  }

  async getUsers(search?: string) {
    return this.prisma.user.findMany({
      where: search ? { email: { contains: search, mode: 'insensitive' } } : {},
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        isBanned: true,
        tokenBalance: true,
        reputationScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async banUser(targetUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const targetUser = await tx.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) throw new BadRequestException('User not found');
      if (targetUser.role === Role.ADMIN) throw new ForbiddenException('Cannot ban another ADMIN');

      // 1. User status -> BANNED
      const updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: { isBanned: true },
      });

      // 2 & 3. Cancel PENDING sessions
      const pendingSessions = await tx.session.findMany({
        where: {
          OR: [ { studentId: targetUserId }, { mentorId: targetUserId } ],
          status: 'PENDING'
        },
        include: { escrow: true },
      });

      for (const session of pendingSessions) {
        await tx.session.update({
          where: { id: session.id },
          data: { status: 'CANCELLED' }
        });

        // 4. Refund escrows
        const escrow = session.escrow;
        if (escrow && escrow.status === 'LOCKED') {
          // Refund to student
          await tx.user.update({
            where: { id: session.studentId },
            data: { tokenBalance: { increment: escrow.amount } }
          });

          await tx.transaction.create({
            data: {
              toUser: { connect: { id: session.studentId } },
              amount: escrow.amount,
              type: 'ESCROW_RELEASE',
              status: 'COMPLETED',
              referenceId: session.id
            }
          });

          await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'REFUNDED' }
          });
        }
      }

      return updatedUser;
    });
  }
}
