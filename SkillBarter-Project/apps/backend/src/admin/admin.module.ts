import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LedgerModule } from '../ledger/ledger.module';
import { RedisModule } from '../redis/redis.module';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule, LedgerModule, RedisModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
