import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public readonly pubClient: Redis;
  public readonly subClient: Redis;
  public readonly client: Redis;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    this.pubClient = new Redis(url);
    this.subClient = new Redis(url);
    this.client = this.pubClient;
  }

  onModuleInit() {
    this.pubClient.on('error', (err) => {
      console.error('Redis pub error', err);
    });
    this.subClient.on('error', (err) => {
      console.error('Redis sub error', err);
    });
  }

  onModuleDestroy() {
    this.pubClient.disconnect();
    this.subClient.disconnect();
  }
}

