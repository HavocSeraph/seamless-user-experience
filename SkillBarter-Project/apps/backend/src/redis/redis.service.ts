import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis(this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379');
  }

  onModuleInit() {
    this.client.on('error', (err) => {
      console.error('Redis error', err);
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}

