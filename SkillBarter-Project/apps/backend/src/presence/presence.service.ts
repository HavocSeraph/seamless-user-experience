import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PresenceService {
  constructor(private readonly redisService: RedisService) {}

  async markOnline(userId: string, socketId: string): Promise<void> {
    const key = `presence:${userId}`;
    await this.redisService.pubClient.sadd(key, socketId);
    await this.redisService.pubClient.expire(key, 60);
  }

  async markOffline(userId: string, socketId: string): Promise<boolean> {
    const key = `presence:${userId}`;
    await this.redisService.pubClient.srem(key, socketId);
    const count = await this.redisService.pubClient.scard(key);
    if (count === 0) {
      await this.redisService.pubClient.del(key);
      return true;
    }
    return false;
  }

  async isOnline(userId: string): Promise<boolean> {
    const count = await this.redisService.pubClient.scard(`presence:${userId}`);
    return count > 0;
  }
}
