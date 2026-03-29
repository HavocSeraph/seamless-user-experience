import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LedgerModule } from './ledger/ledger.module';
import { SkillsModule } from './skills/skills.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SessionsModule } from './sessions/sessions.module';
import { LivekitModule } from './livekit/livekit.module';

@Module({
  imports: [
    PrismaModule,
    LedgerModule,
    SkillsModule,
    MarketplaceModule,
    SessionsModule,
    LivekitModule
  ]
})
export class AppModule {}

