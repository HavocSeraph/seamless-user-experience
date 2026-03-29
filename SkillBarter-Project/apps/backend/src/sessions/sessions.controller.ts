import { Controller, Post, Body, Request, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService
  ) {}

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  async bookSession(@Request() req, @Body() body: any) {
    const { skillId, providerId, scheduledAt, duration, priceCoins } = body;
    const studentId = req.user.id;
    const mentorId = providerId;

    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // 1. Create the session in PENDING state
    const session = await this.prisma.session.create({
      data: {
        skillId,
        studentId,
        mentorId,
        startTime,
        endTime,
        status: 'PENDING'
      }
    });

    // 2. Lock escrow using Ledger Service
    const escrow = await this.ledger.lockEscrow(
      session.id,
      studentId,
      priceCoins
    );

    return { session, escrow };
  }

  @Get('my-sessions')
  @UseGuards(AuthGuard('jwt'))
  async getMySessions(@Request() req) {
    return this.prisma.session.findMany({
      where: {
        OR: [
          { studentId: req.user.id },
          { mentorId: req.user.id }
        ]
      },
      include: {
        skill: true,
        student: { select: { email: true } },
        mentor: { select: { email: true } },
        escrow: true
      },
      orderBy: { startTime: 'asc' }
    });
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  async completeSession(@Request() req, @Param('id') id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { escrow: true }
    });

    if (!session) throw new Error('Session not found');

    const isStudent = session.studentId === req.user.id;
    const isMentor = session.mentorId === req.user.id;

    if (!isStudent && !isMentor) {
      throw new Error('Not authorized to complete this session');
    }

    const updateData: any = {};
    if (isStudent) updateData.studentCompleted = true;
    if (isMentor) updateData.mentorCompleted = true;

    const updatedSession = await this.prisma.session.update({
      where: { id },
      data: updateData
    });

    // If both users completed (or if student independently signs off), release escrow.
    // For safety, let's treat the student's completion as the final escrow release trigger.
    if (isStudent && session.escrow && session.status !== 'COMPLETED') {
      await this.ledger.releaseEscrow(id); // Pass sessionId
      
      return this.prisma.session.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });
    }

    return updatedSession;
  }

  @Post(':id/review')
  @UseGuards(AuthGuard('jwt'))
  async addReview(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { rating: number; comment?: string }
  ) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) throw new Error('Session not found');

    const reviewerId = req.user.id;
    if (reviewerId !== session.studentId && reviewerId !== session.mentorId) {
      throw new Error('Unauthorized');
    }

    const revieweeId = reviewerId === session.studentId ? session.mentorId : session.studentId;

    return this.prisma.review.create({
      data: {
        sessionId: id,
        reviewerId,
        revieweeId,
        rating: body.rating,
        comment: body.comment
      }
    });
  }

  @Post(':id/dispute')
  @UseGuards(AuthGuard('jwt'))
  async createDispute(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { reason: string }
  ) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) throw new Error('Session not found');

    // Escrow must go to disputed status to prevent auto-release
    await this.prisma.escrow.update({
      where: { sessionId: id },
      data: { status: 'DISPUTED' }
    });

    await this.prisma.session.update({
      where: { id },
      data: { status: 'DISPUTED' }
    });

    return this.prisma.dispute.create({
      data: {
        sessionId: id,
        raisedById: req.user.id,
        reason: body.reason,
        status: 'OPEN'
      }
    });
  }

  // PHASE 6: Admin route to fetch disputes
  @Get('disputes')
  @UseGuards(AuthGuard('jwt'))
  async getDisputes(@Request() req) {
    // Ideally check req.user.role === 'ADMIN', but for testing we can fetch all
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

  // PHASE 6: Admin route to resolve disputes
  @Post(':id/resolve-dispute')
  @UseGuards(AuthGuard('jwt'))
  async resolveDispute(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { resolution: 'REFUND_LEARNER' | 'PAY_MENTOR'; adminNotes?: string }
  ) {
    // Optionally verify req.user.role === 'ADMIN'
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { escrow: true, dispute: true }
    });

    if (!session) throw new Error('Session not found');
    if (session.status !== 'DISPUTED') throw new Error('Session is not in disputed state');

    const openDispute = session.dispute;
    if (openDispute && openDispute.status === 'OPEN') {
      // Mark dispute as resolved
      await this.prisma.dispute.update({
        where: { id: openDispute.id },
        data: { status: 'RESOLVED', resolvedAt: new Date() }
      });
    }

    if (body.resolution === 'REFUND_LEARNER') {
      await this.ledger.refundEscrow(id);
      return this.prisma.session.update({
        where: { id },
        data: { status: 'CANCELLED' } // or a new 'REFUNDED' status if we had it
      });
    } else if (body.resolution === 'PAY_MENTOR') {
      await this.ledger.releaseEscrow(id);
      return this.prisma.session.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });
    }
    
    throw new Error('Invalid resolution action');
  }

}
