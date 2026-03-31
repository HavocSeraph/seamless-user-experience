import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Phase 5 - Bounty Board & Storage', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({       
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        bounty: {
          create: jest.fn(),
          update: jest.fn(),
        },
        escrow: {
          create: jest.fn(),
          update: jest.fn(),
        },
        transaction: {
          create: jest.fn(),
        },
        $transaction: jest.fn(async (cb) => {
          const fakeTx = {
            user: { update: jest.fn() },
            transaction: { create: jest.fn() },
            bounty: { create: jest.fn().mockResolvedValue({ id: 'bounty-1' }), update: jest.fn() },
            escrow: { create: jest.fn(), update: jest.fn() },
            notification: { create: jest.fn() }
          };
          return cb(fakeTx); 
        }),
      })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: () => true, 
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    app.use((req: any, res: any, next: any) => {
        req.user = { id: 'test-user-id' };
        next();
    });

    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. GET /storage/presigned-url works without file payloads (No multer)', async () => {
    return request(app.getHttpServer())
      .get('/storage/presigned-url?filename=test.mp4&contentType=video/mp4')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('url');
        expect(res.body).toHaveProperty('key');
      });
  });

  it('2. Bounty creation fails if user balance < rewardCoins', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-user-id',
      tokenBalance: 50,
    } as any);

    return request(app.getHttpServer())
      .post('/bounties')
      .send({
        title: 'Need help with React',
        description: 'React hooks issue',
        category: 'Frontend',
        rewardCoins: 100 // More than balance
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('Insufficient token balance');
      });
  });

  it('3. Bounty creation succeeds with atomic escrow locking', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'test-user-id',
      tokenBalance: 200,
    } as any);

    const txMock = jest.spyOn(prisma, '$transaction');

    await request(app.getHttpServer())
      .post('/bounties')
      .send({
        title: 'Need help with React',
        description: 'React hooks issue',
        category: 'Frontend',
        rewardCoins: 50 
      })
      .expect(201);
      
    expect(txMock).toHaveBeenCalled();
  });
});
