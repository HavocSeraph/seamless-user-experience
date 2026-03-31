import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { EscrowStatus } from '@prisma/client';

describe('Phase 4 - Live Classroom & Escrow', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({       
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        session: {
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        escrow: {
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        user: {
          findUnique: jest.fn(),
          findFirst: jest.fn(),
          update: jest.fn(),
        },
        transaction: {
          create: jest.fn(),
        },
        $transaction: jest.fn(async (cb) => {
          const fakeTx = {
            user: { update: jest.fn(), findFirst: jest.fn().mockResolvedValue({ id: 'admin-id', role: 'ADMIN' }) },
            transaction: { create: jest.fn() },
            session: { update: jest.fn(), findUnique: jest.fn().mockResolvedValue({ mentorId: 'test-mentor-id', studentId: 'test-student-id' }) },
            escrow: { update: jest.fn(), findUnique: jest.fn().mockResolvedValue({ sessionId: 'session-3', status: 'LOCKED', amount: 100 }) },
          };
          return cb(fakeTx); // Execute callback with fakeTx to simulate single transaction
        }),
      })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: () => true, // Bypass JWT check for mocks
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    
    // Inject mock user
    app.use((req: any, res: any, next: any) => {
        req.user = { id: 'test-student-id', username: 'teststudent', email: 'teststudent@test.com' };
        next();
    });

    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Token generation blocked if more than 10 mins before start time', async () => {
    jest.spyOn(prisma.session, 'findUnique').mockResolvedValue({
      id: 'session-1',
      studentId: 'test-student-id',
      mentorId: 'test-mentor-id',
      startTime: new Date(Date.now() + 60 * 60000), // starts in 1 hour
    } as any);

    return request(app.getHttpServer())
      .get('/livekit/token/session-1')
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toContain('Room is not yet open');
      });
  });

  it('2. Livekit token generated successfully within 10 min window', async () => {
    jest.spyOn(prisma.session, 'findUnique').mockResolvedValue({
      id: 'session-2',
      studentId: 'test-student-id',
      mentorId: 'test-mentor-id',
      startTime: new Date(Date.now() + 5 * 60000), // starts in 5 minutes
      livekitRoomId: null,
    } as any);

    return request(app.getHttpServer())
      .get('/livekit/token/session-2')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
      });
  });

  it('3. Both-Party Completion triggers Escrow Release (Atomic)', async () => {
    // We are logged in as 'test-student-id'. 
    // Say the mentor already completed, and now student completes.
    jest.spyOn(prisma.session, 'findUnique').mockResolvedValue({
      id: 'session-3',
      studentId: 'test-student-id',
      mentorId: 'test-mentor-id',
      mentorCompleted: true,
      studentCompleted: false,
      status: 'ACTIVE',
    } as any);

    // Mock update return showing both are completed
    jest.spyOn(prisma.session, 'update').mockResolvedValue({
      id: 'session-3',
      mentorCompleted: true,
      studentCompleted: true,
    } as any);

    // Setup for ledger service release
    jest.spyOn(prisma.escrow, 'findUnique').mockResolvedValue({
      sessionId: 'session-3',
      status: 'LOCKED',
      amount: 100,
    } as any);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      id: 'admin-id',
      role: 'ADMIN',
    } as any);

    const txMock = jest.spyOn(prisma, '$transaction');

    await request(app.getHttpServer())
      .patch('/sessions/session-3/complete')
      .expect(200);

    // We verify a single $transaction was called for completing the session & releasing escrow
    expect(txMock).toHaveBeenCalled();
  });
}); 
