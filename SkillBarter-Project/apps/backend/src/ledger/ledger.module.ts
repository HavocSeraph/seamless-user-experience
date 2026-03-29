import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletController } from './wallet.controller';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [PrismaModule],
  providers: [LedgerService],
  controllers: [WalletController, TransactionsController],
  exports: [LedgerService]
})
export class LedgerModule {}

