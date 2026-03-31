import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createNotification(userId: string, type: string, message: string): Promise<Notification> {
    // Phase 6 Critical Rule: Save notification to DB BEFORE WebSocket emit
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });

    // Publish to Redis for WebSocket layer to pick up and push to online users
    try {
      await this.redisService.pubClient.publish(
        'notification.new',
        JSON.stringify({ userId, notification }),
      );
    } catch (err) {
      this.logger.error('Failed to publish notification to Redis', err);
    }

    return notification;
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
