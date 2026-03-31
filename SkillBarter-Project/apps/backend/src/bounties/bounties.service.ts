import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { EscrowStatus, TransactionType, BountyStatus } from '@prisma/client';

@Injectable()
export class BountiesService {
  constructor(private prisma: PrismaService) {}

  async createBounty(userId: string, dto: CreateBountyDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    // Critical Rule 59: Validate balance BEFORE creating bounty
    if (user.tokenBalance < dto.rewardCoins) {
      throw new BadRequestException('Insufficient token balance to create this bounty');
    }

    // Critical Rule 60: Escrow locked atomically with bounty creation
    return this.prisma.$transaction(async (tx) => {
      // 1. Deduct from poster
      await tx.user.update({
        where: { id: userId },
        data: { tokenBalance: { decrement: dto.rewardCoins } },
      });

      // 2. Create the Bounty
      const bounty = await tx.bounty.create({
        data: {
          posterId: userId,
          title: dto.title,
          description: dto.description,
          category: dto.category,
          rewardCoins: dto.rewardCoins,
          status: BountyStatus.OPEN,
          // expiresAt defaults to 7 days in schema
        },
      });

      // 3. Create Escrow Lock Record
      await tx.transaction.create({
        data: {
          fromUserId: userId,
          amount: dto.rewardCoins,
          type: TransactionType.ESCROW_LOCK,
          referenceId: bounty.id,
        },
      });

      // 4. Create the Escrow
      await tx.escrow.create({
        data: {
          bountyId: bounty.id,
          amount: dto.rewardCoins,
          status: EscrowStatus.LOCKED,
        },
      });

      return bounty;
    });
  }
}

