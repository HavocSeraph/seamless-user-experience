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

  // Completing the session loop
  @Post(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  async completeSession(@Request() req, @Param('id') id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { escrow: true }
    });

    if (!session) throw new Error('Session not found');

    // Ensure learner is the one completing (approving release)
    if (session.studentId !== req.user.id) {
       throw new Error('Only the student can mark the session as complete');
    }

    // Release escrow
    if (session.escrow) {
      await this.ledger.releaseEscrow(session.escrow.id);
    }

    // Update Session status
    return this.prisma.session.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });
  }
}
