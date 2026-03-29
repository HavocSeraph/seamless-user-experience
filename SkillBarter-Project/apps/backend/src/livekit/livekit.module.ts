import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LivekitController } from './livekit.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LivekitService],
  controllers: [LivekitController],
  exports: [LivekitService],
})
export class LivekitModule {}
