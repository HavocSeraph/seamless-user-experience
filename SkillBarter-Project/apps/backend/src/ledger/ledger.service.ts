import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, TransactionStatus, EscrowStatus, Role, Escrow } from '@prisma/client';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async credit(userId: string, amount: number, type: TransactionType, referenceId?: string): Promise<void> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: { increment: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          toUserId: userId,
          amount,
          type,
          status: TransactionStatus.COMPLETED,
          referenceId,
        }
      })
    ]);
  }

  async debit(userId: string, amount: number, type: TransactionType, referenceId?: string): Promise<void> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.tokenBalance < amount) throw new BadRequestException('Insufficient balance');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: { decrement: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          fromUserId: userId,
          amount,
          type,
          status: TransactionStatus.COMPLETED,
          referenceId,
        }
      })
    ]);
  }

  async lockEscrow(sessionId: string, studentId: string, amount: number): Promise<Escrow> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    if (user.tokenBalance < amount) throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: studentId },
        data: { tokenBalance: { decrement: amount } }
      });
      await tx.transaction.create({
        data: {
          fromUserId: studentId,
          amount,
          type: TransactionType.ESCROW_LOCK,
          referenceId: sessionId,
        }
      });
      return tx.escrow.create({
        data: {
          sessionId,
          amount,
          status: EscrowStatus.LOCKED,
        }
      });
    });
  }

  async releaseEscrow(sessionId: string): Promise<void> {
    const escrow = await this.prisma.escrow.findUnique({ where: { sessionId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== EscrowStatus.LOCKED) throw new BadRequestException('Escrow is not locked');

    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    const tax = Math.floor(escrow.amount * 0.05);
    const netToMentor = escrow.amount - tax;
    const adminUser = await this.prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (!adminUser) throw new NotFoundException('System Admin wallet not configured');

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.mentorId },
        data: { 
          tokenBalance: { increment: netToMentor },
          teachingStreak: { increment: 1 }
        }
      });
      await tx.user.update({
        where: { id: adminUser.id },
        data: { tokenBalance: { increment: tax } }
      });
      await tx.transaction.create({
        data: {
          toUserId: session.mentorId,
          amount: netToMentor,
          type: TransactionType.ESCROW_RELEASE,
          referenceId: sessionId
        }
      });
      if (tax > 0) {
        await tx.transaction.create({
          data: {
            toUserId: adminUser.id,
            amount: tax,
            type: TransactionType.TAX,
            referenceId: sessionId
          }
        });
      }
      await tx.escrow.update({
        where: { sessionId },
        data: { status: EscrowStatus.RELEASED, resolvedAt: new Date() }
      });
    });
  }

  async refundEscrow(sessionId: string): Promise<void> {
    const escrow = await this.prisma.escrow.findUnique({ where: { sessionId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== EscrowStatus.LOCKED) throw new BadRequestException('Escrow is not locked');

    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.studentId },
        data: { tokenBalance: { increment: escrow.amount } }
      });
      await tx.transaction.create({
        data: {
          toUserId: session.studentId,
          amount: escrow.amount,
          type: TransactionType.ESCROW_RELEASE,
          referenceId: sessionId
        }
      });
      await tx.escrow.update({
        where: { sessionId },
        data: { status: EscrowStatus.REFUNDED, resolvedAt: new Date() }
      });
    });
  }

  async freezeEscrow(sessionId: string): Promise<void> {
    const escrow = await this.prisma.escrow.findUnique({ where: { sessionId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== EscrowStatus.LOCKED) throw new BadRequestException('Escrow is not locked');

    await this.prisma.escrow.update({
      where: { sessionId },
      data: { status: EscrowStatus.DISPUTED }
    });
  }

  async applyNoShowPenalty(mentorId: string, studentId: string, sessionId: string): Promise<void> {
    const PENALTY_AMOUNT = 10;
    const mentor = await this.prisma.user.findUniqueOrThrow({ where: { id: mentorId } });
    const penaltyAmount = Math.min(PENALTY_AMOUNT, mentor.tokenBalance);
    
    if (penaltyAmount === 0) return;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: mentorId },
        data: { tokenBalance: { decrement: penaltyAmount } }
      }),
      this.prisma.user.update({
        where: { id: studentId },
        data: { tokenBalance: { increment: penaltyAmount } }
      }),
      this.prisma.transaction.create({
        data: {
          fromUserId: mentorId,
          toUserId: studentId,
          amount: penaltyAmount,
          type: TransactionType.PENALTY,
          referenceId: sessionId
        }
      })
    ]);
  }

  async lockBountyEscrow(bountyId: string, posterId: string, amount: number): Promise<Escrow> {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: posterId } });
    if (user.tokenBalance < amount) throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: posterId },
        data: { tokenBalance: { decrement: amount } }
      });
      await tx.transaction.create({
        data: {
          fromUserId: posterId,
          amount,
          type: TransactionType.ESCROW_LOCK,
          referenceId: bountyId,
        }
      });
      return tx.escrow.create({
        data: {
          bountyId,
          amount,
          status: EscrowStatus.LOCKED,
        }
      });
    });
  }

  async releaseBountyEscrow(bountyId: string, responderId: string): Promise<void> {
    const escrow = await this.prisma.escrow.findUnique({ where: { bountyId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status !== EscrowStatus.LOCKED) throw new BadRequestException('Escrow is not locked');

    const tax = Math.floor(escrow.amount * 0.05);
    const netToResponder = escrow.amount - tax;
    const adminUser = await this.prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (!adminUser) throw new NotFoundException('System Admin wallet not configured');

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: responderId },
        data: { tokenBalance: { increment: netToResponder } }
      });
      await tx.user.update({
        where: { id: adminUser.id },
        data: { tokenBalance: { increment: tax } }
      });
      await tx.transaction.create({
        data: {
          toUserId: responderId,
          amount: netToResponder,
          type: TransactionType.ESCROW_RELEASE,
          referenceId: bountyId
        }
      });
      if (tax > 0) {
        await tx.transaction.create({
          data: {
            toUserId: adminUser.id,
            amount: tax,
            type: TransactionType.TAX,
            referenceId: bountyId
          }
        });
      }
      await tx.escrow.update({
        where: { bountyId },
        data: { status: EscrowStatus.RELEASED, resolvedAt: new Date() }
      });
    });
  }
}

