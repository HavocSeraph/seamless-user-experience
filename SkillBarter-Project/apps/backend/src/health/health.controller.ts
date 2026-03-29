import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MicroserviceHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private redis: MicroserviceHealthIndicator,
    private prisma: PrismaService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.redis.pingCheck('redis', { 
        transport: Transport.REDIS, 
        options: { host: process.env.REDIS_HOST || 'localhost', port: 6379 } 
      })
    ]);
  }
}