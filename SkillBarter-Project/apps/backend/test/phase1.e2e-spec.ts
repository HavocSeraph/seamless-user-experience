import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Phase 1 - Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
          findUniqueOrThrow: jest.fn(),
        },
        $transaction: jest.fn(async (cb) => {
          const fakeTx = {
            user: {
              create: jest.fn().mockResolvedValue({
                id: 'test-id',
                email: 'test@example.com',
                passwordHash: '$2b$12$somehashedpasswordstring', /* Note the 12 rounds in the hash prefix */
                name: 'Test Setup',
                tokenBalance: 50,
                role: 'USER',
              })
            },
            transaction: {
              create: jest.fn().mockResolvedValue({ id: 'tx-1' })
            }
          };
          return cb(fakeTx);
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - Valid payload', async () => {
    // Setup mocks
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password1!', name: 'Test User' })
      .expect(201);

    expect(response.body.user).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.passwordHash).toBeUndefined();
    expect(response.body.user.passwordHash).toBeUndefined();
    
    // Check if refresh token is in Set-Cookie and HttpOnly
    const setCookie = response.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const hasHttpOnlyRefreshToken = setCookie.some(cookie => cookie.includes('refreshToken=') && cookie.includes('HttpOnly'));
    expect(hasHttpOnlyRefreshToken).toBeTruthy();
  });

  it('/auth/register (POST) - Extra fields stripped/rejected', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test2@example.com',
        password: 'Password1!',
        name: 'Test2 User',
        isAdmin: true, // Should cause failure because of forbidNonWhitelisted
      })
      .expect(400);
  });

  it('/auth/register (POST) - Duplicate email', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 'existing' } as any);
    
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'existing@example.com', password: 'Password1!', name: 'Test User' })
      .expect(409);
  });

  it('/auth/me (GET) - No auth header -> 401', async () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  it('/auth/me (GET) - Malformed token -> 401', async () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.value')
      .expect(401);
  });
});
