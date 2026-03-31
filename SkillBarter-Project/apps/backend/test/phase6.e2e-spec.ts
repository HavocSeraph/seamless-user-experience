import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { NotificationsService } from '../src/notifications/notifications.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { PresenceService } from '../src/presence/presence.service';

describe('Phase 6: Notifications & Realtime (e2e)', () => {
  let app: INestApplication;
  let notificationsService: NotificationsService;
  let redisService: RedisService;
  let presenceService: PresenceService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService)
    .useValue({
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
      }
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    notificationsService = app.get<NotificationsService>(NotificationsService);
    redisService = app.get<RedisService>(RedisService);
    presenceService = app.get<PresenceService>(PresenceService);
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('CRITICAL: Verify TWO separate ioredis instances exist', () => {
    expect(redisService.pubClient).toBeDefined();
    expect(redisService.subClient).toBeDefined();
    expect(redisService.pubClient).not.toBe(redisService.subClient); // MUST BE SEPARATE
  });

  it('CRITICAL: Verify notification is saved to DB BEFORE WebSocket emit', async () => {
    const saveSpy = jest.spyOn(prisma.notification, 'create').mockResolvedValue({
      id: 'fake-notif-id',
      userId: 'user-1',
      type: 'bounty.accepted',
      message: 'Your answer was accepted',
      isRead: false,
      createdAt: new Date(),
    } as any);

    const publishSpy = jest.spyOn(redisService.pubClient, 'publish').mockResolvedValue(1);

    const notification = await notificationsService.createNotification(
      'user-1',
      'bounty.accepted',
      'Your answer was accepted'
    );

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(publishSpy).toHaveBeenCalledWith('notification.new', expect.any(String));
    expect(notification.id).toBe('fake-notif-id');
    
    saveSpy.mockRestore();
    publishSpy.mockRestore();
  });

  it('CRITICAL: Online presence tracking TTL', async () => {
    const pubSpy = jest.spyOn(redisService.pubClient, 'sadd').mockResolvedValue(1);
    const expireSpy = jest.spyOn(redisService.pubClient, 'expire').mockResolvedValue(1);
    const sremSpy = jest.spyOn(redisService.pubClient, 'srem').mockResolvedValue(1);
    const scardSpy = jest.spyOn(redisService.pubClient, 'scard').mockResolvedValue(0);
    const delSpy = jest.spyOn(redisService.pubClient, 'del').mockResolvedValue(1);

    await presenceService.markOnline('user-5', 'socket-X');
    expect(pubSpy).toHaveBeenCalledWith('presence:user-5', 'socket-X');
    expect(expireSpy).toHaveBeenCalledWith('presence:user-5', 60);

    const isFullyOffline = await presenceService.markOffline('user-5', 'socket-X');
    expect(sremSpy).toHaveBeenCalledWith('presence:user-5', 'socket-X');
    expect(scardSpy).toHaveBeenCalledWith('presence:user-5');
    expect(delSpy).toHaveBeenCalledWith('presence:user-5');
    expect(isFullyOffline).toBe(true);

    pubSpy.mockRestore();
    expireSpy.mockRestore();
    sremSpy.mockRestore();
    scardSpy.mockRestore();
    delSpy.mockRestore();
  });
});
