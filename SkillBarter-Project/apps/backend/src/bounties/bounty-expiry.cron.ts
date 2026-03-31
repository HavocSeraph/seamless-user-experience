import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { BountyStatus, EscrowStatus, TransactionType } from '@prisma/client';

@Injectable()
export class BountyExpiryCron {
  private readonly logger = new Logger(BountyExpiryCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running Bounty Expiry Cron Job...');

    const expiredBounties = await this.prisma.bounty.findMany({
      where: {
        status: { in: [BountyStatus.OPEN, BountyStatus.ANSWERED] },
        expiresAt: { lt: new Date() },
      },
      include: { escrow: true },
    });

    for (const bounty of expiredBounties) {
      if (!bounty.escrow || bounty.escrow.status !== EscrowStatus.LOCKED) {
        this.logger.warn(`Skipping bounty ${bounty.id}: Escrow not locked`);
        continue;
      }

      const escrowAmount = bounty.escrow.amount;

      await this.prisma.$transaction(async (tx) => {
        // 1. Escrow refunded to poster in full (NO tax)
        await tx.user.update({
          where: { id: bounty.posterId },
          data: { tokenBalance: { increment: escrowAmount } },
        });

        await tx.transaction.create({
          data: {
            toUserId: bounty.posterId,
            amount: escrowAmount,
            type: TransactionType.ESCROW_RELEASE,
            referenceId: bounty.id,
          },
        });

        await tx.escrow.update({
          where: { bountyId: bounty.id },
          data: { status: EscrowStatus.REFUNDED, resolvedAt: new Date() },
        });

        // 2. Bounty status -> EXPIRED
        await tx.bounty.update({
          where: { id: bounty.id },
          data: { status: BountyStatus.EXPIRED },
        });

        // 3. Poster notified
        await tx.notification.create({
          data: {
            userId: bounty.posterId,
            type: 'BOUNTY_EXPIRED',
            message: `Your bounty '${bounty.title}' has expired and tokens were refunded.`,
          },
        });
      });

      this.logger.log(`Bounty ${bounty.id} expired and refunded successfully.`);
    }
  }
}
 
