import { Controller, Get, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private prisma: PrismaService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { tokenBalance: true, teachingStreak: true, reputationScore: true }
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      balance: user.tokenBalance,
      teachingStreak: user.teachingStreak,
      reputationScore: user.reputationScore
    };
  }

  @Get('summary')
  async getSummary(@Request() req) {
    const userId = req.user.id;

    const totalEarnedResult = await this.prisma.transaction.aggregate({
      where: {
        toUserId: userId,
        type: { in: ['EARN', 'ESCROW_RELEASE', 'BOUNTY'] }
      },
      _sum: { amount: true }
    });
    const totalEarned = totalEarnedResult._sum.amount || 0;

    const totalSpentResult = await this.prisma.transaction.aggregate({
      where: {
        fromUserId: userId,
        type: { in: ['SPEND', 'ESCROW_LOCK'] }
      },
      _sum: { amount: true }
    });
    const totalSpent = totalSpentResult._sum.amount || 0;

    const totalSessions = await this.prisma.session.count({
      where: {
        mentorId: userId,
        status: 'COMPLETED'
      }
    });

    const totalBountiesAnswered = await this.prisma.bountyAnswer.count({
      where: {
        responderId: userId,
        isAccepted: true
      }
    });

    return {
      totalEarned,
      totalSpent,
      totalSessions,
      totalBountiesAnswered
    };
  }
}

