import { Controller, Get, Post, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService
  ) {}

  // Middleware to ensure user is ADMIN
  private async ensureAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.ADMIN) {
      throw new Error('Forbidden: Admins only');
    }
  }

  @Get('stats')
  async getStats(@Request() req) {
    await this.ensureAdmin(req.user.id);
    
    const [totalUsers, activeSessions, totalEscrow, totalDisputes] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.session.count({ where: { status: 'ACTIVE' } }),
      this.prisma.escrow.aggregate({ _sum: { amount: true }, where: { status: { in: ['LOCKED', 'DISPUTED'] } } }),
      this.prisma.dispute.count()
    ]);

    return {
      totalUsers,
      activeSessions,
      lockedEscrow: totalEscrow._sum.amount || 0,
      totalDisputes
    };
  }

  @Get('users')
  async getUsers(@Request() req, @Query('search') search?: string) {
    await this.ensureAdmin(req.user.id);
    
    return this.prisma.user.findMany({
      where: search ? { email: { contains: search, mode: 'insensitive' } } : {},
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        tokenBalance: true,
        reputationScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Get('disputes')
  async getDisputes(@Request() req) {
    await this.ensureAdmin(req.user.id);
    return this.prisma.dispute.findMany({
      where: { status: 'OPEN' },
      include: {
        session: {
          include: {
            student: { select: { email: true } },
            mentor: { select: { email: true } },
            escrow: true
          }
        },
        raisedBy: { select: { email: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  @Post('disputes/:id/resolve')
  async resolveDispute(
    @Request() req,
    @Param('id') id: string, // session ID
    @Body() body: { decision: 'REFUND_TO_STUDENT' | 'RELEASE_TO_MENTOR' | 'SPLIT'; adminNotes?: string }
  ) {
    await this.ensureAdmin(req.user.id);

    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { escrow: true, dispute: true }
    });

    if (!session) throw new Error('Session not found');
    if (session.status !== 'DISPUTED') throw new Error('Session is not in disputed state');

    const openDispute = session.dispute;
    if (openDispute && openDispute.status === 'OPEN') {
      await this.prisma.dispute.update({
        where: { id: openDispute.id },
        data: { 
          status: 'RESOLVED', 
          resolvedAt: new Date(),
          decision: body.decision,
          adminNotes: body.adminNotes
        }
      });
    }

    if (body.decision === 'REFUND_TO_STUDENT') {
      await this.ledger.refundEscrow(id);
      return this.prisma.session.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });
    } else if (body.decision === 'RELEASE_TO_MENTOR') {
      await this.ledger.releaseEscrow(id);
      return this.prisma.session.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });
    } else if (body.decision === 'SPLIT') {
      await this.ledger.splitEscrow(id);
      return this.prisma.session.update({
        where: { id },
        data: { status: 'COMPLETED' } // Treat as completed since both got something
      });
    }

    throw new Error('Invalid resolution action');
  }
}
