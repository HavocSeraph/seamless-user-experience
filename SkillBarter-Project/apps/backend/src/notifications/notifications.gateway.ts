import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PresenceService } from '../presence/presence.service';
import { RedisService } from '../redis/redis.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly presenceService: PresenceService,
    private readonly redisService: RedisService,
  ) {}

  afterInit() {
    this.logger.log('WebSockets initialized');
    
    // Subscribe to redis events for notifications
    this.redisService.subClient.subscribe('notification.new', (err) => {
      if (err) this.logger.error('Failed to subscribe to notification.new', err);
    });

    this.redisService.subClient.on('message', (channel, message) => {
      if (channel === 'notification.new') {
        const payload = JSON.parse(message);
        // emit to specific user's room
        this.server.to(`user:${payload.userId}`).emit('notification.new', payload.notification);
      }
    });
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');

      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId;
      
      client.data.userId = userId;
      client.join(`user:${userId}`);

      await this.presenceService.markOnline(userId, client.id);
      
      // Broadcast user online status
      await this.redisService.pubClient.publish('user.online', JSON.stringify({ userId }));
      
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
    } catch (error) {
      this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const fullyOffline = await this.presenceService.markOffline(userId, client.id);
      if (fullyOffline) {
        // Broadcast user offline status
        await this.redisService.pubClient.publish('user.offline', JSON.stringify({ userId }));
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
