import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- THIS IS CRITICAL. Without this, no other module can use it.
})
export class PrismaModule {}