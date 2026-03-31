import { Module } from '@nestjs/common';
import { BountiesController } from './bounties.controller';
import { BountiesService } from './bounties.service';
import { BountyExpiryCron } from './bounty-expiry.cron';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BountiesController],
  providers: [BountiesService, BountyExpiryCron]
})
export class BountiesModule {}
