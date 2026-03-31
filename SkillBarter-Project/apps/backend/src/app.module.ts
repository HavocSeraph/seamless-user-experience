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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BountiesModule } from './bounties/bounties.module';
import { StorageModule } from './storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import { PresenceModule } from './presence/presence.module';

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
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    LedgerModule,
    SkillsModule,
    MarketplaceModule,
    SessionsModule,
    LivekitModule,
    AdminModule,
    HealthModule,
    BountiesModule,
    StorageModule,
    NotificationsModule,
    PresenceModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
