import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LedgerModule } from './ledger/ledger.module';
import { AuthModule } from './auth/auth.module';
import { SkillsModule } from './skills/skills.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { SessionsModule } from './sessions/sessions.module';
import { LivekitModule } from './livekit/livekit.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
      }
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
    PrismaModule,
    AuthModule,
    LedgerModule,
    SkillsModule,
    MarketplaceModule,
    SessionsModule,
    LivekitModule,
    AdminModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

