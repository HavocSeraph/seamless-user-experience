import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarketplaceController]
})
export class MarketplaceModule {}
