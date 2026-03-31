import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Phase 3 - Marketplace', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({       
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        skill: {
          findUnique: jest.fn(),
        },
        session: {
          create: jest.fn(),
          findUnique: jest.fn()
        },
        user: {
          findUnique: jest.fn()
        },
        $queryRaw: jest.fn(),
        $transaction: jest.fn(async (cb) => {
          const fakeTx = {
            user: { update: jest.fn() },
            transaction: { create: jest.fn().mockResolvedValue({ id: 'tx-1' }), update: jest.fn() },
            session: { create: jest.fn().mockResolvedValue({ id: 'session-1' }) },
            escrow: { create: jest.fn() },
          };
          return cb(fakeTx);
        }),
      })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: () => true, // Just pass validation
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    // Inject mock user
    app.use((req: any, res: any, next: any) => {
        req.user = { id: 'test-user-id', username: 'testuser' };
        next();
    });

    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Student cannot book their own skill', async () => {
    jest.spyOn(prisma.skill, 'findUnique').mockResolvedValue({
      id: 'skill-1',
      userId: 'test-user-id',
      isActive: true,
      priceCoins: 50,
      level: 'BEGINNER'
    } as any);

    return request(app.getHttpServer())
      .post('/sessions/book')
      .send({ skillId: 'skill-1', providerId: 'test-user-id', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 60, priceCoins: 50 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Cannot book your own skill');
      });
  });

  it('2. Student balance must be >= skill price', async () => {
    jest.spyOn(prisma.skill, 'findUnique').mockResolvedValue({
      id: 'skill-1',
      userId: 'other-user-id',
      isActive: true,
      priceCoins: 50,
      level: 'BEGINNER'
    } as any);

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-user-id',
      tokenBalance: 10
    } as any);

    return request(app.getHttpServer())
      .post('/sessions/book')
      .send({ skillId: 'skill-1', providerId: 'other-user-id', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 60, priceCoins: 50 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Insufficient balance');
      });
  });

  it('3. Booking atomicity', async () => {
    jest.spyOn(prisma.skill, 'findUnique').mockResolvedValue({
      id: 'skill-1',
      userId: 'other-user-id',
      isActive: true,
      priceCoins: 50,
      level: 'BEGINNER'
    } as any);

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-user-id',
      tokenBalance: 100
    } as any);

    jest.spyOn(prisma, '$queryRaw').mockResolvedValue([]);

    const txMock = jest.spyOn(prisma, '$transaction');

    await request(app.getHttpServer())
      .post('/sessions/book')
      .send({ skillId: 'skill-1', providerId: 'other-user-id', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 60, priceCoins: 50 })
      .expect(201);

    expect(txMock).toHaveBeenCalled();
  });
});
