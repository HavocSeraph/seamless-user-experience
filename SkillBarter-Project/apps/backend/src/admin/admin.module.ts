import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [PrismaModule, LedgerModule],
  controllers: [AdminController]
})
export class AdminModule {}
