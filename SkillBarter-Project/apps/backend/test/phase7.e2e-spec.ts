import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('Phase 7 - Admin Panel & Dispute Resolution (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let mentorToken: string;
  let studentToken: string;

  let adminId: string;
  let mentorId: string;
  let studentId: string;

  let sessionId: string;
  let disputeId: string;

  jest.setTimeout(60000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Clean up
    await prisma.dispute.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.escrow.deleteMany();
    await prisma.session.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        passwordHash: await bcrypt.hash('adminpass', 10),
        role: 'ADMIN',
        tokenBalance: 0
      }
    });
    adminId = admin.id;

    // Create Mentor
    const mentor = await prisma.user.create({
      data: {
        email: 'mentor@test.com',
        name: 'Mentor User',
        passwordHash: await bcrypt.hash('mentorpass', 10),
        role: 'USER',
        tokenBalance: 50
      }
    });
    mentorId = mentor.id;

    // Create Student
    const student = await prisma.user.create({
      data: {
        email: 'student@test.com',
        name: 'Student User',
        passwordHash: await bcrypt.hash('studentpass', 10),
        role: 'USER',
        tokenBalance: 200
      }
    });
    studentId = student.id; 
 adminToken = jwtService.sign({ sub: adminId, email: admin.email, role: admin.role }); mentorToken = jwtService.sign({ sub: mentorId, email: mentor.email, role: mentor.role }); studentToken = jwtService.sign({ sub: studentId, email: student.email, role: student.role });

    // Create Skill
    const skill = await prisma.skill.create({
      data: { title: 'Admining', category: 'Testing', description: 'Test', level: 'BEGINNER', priceCoins: 100, userId: mentorId }
    });

    // Create a disputed session
    const session = await prisma.session.create({
      data: {
        studentId,
        mentorId,
        skillId: skill.id,
        status: 'DISPUTED',
                startTime: new Date(), endTime: new Date(Date.now() + 100000 + 3600),
                
      }
    });
    sessionId = session.id;

    // Escrow for session
    await prisma.escrow.create({
      data: {
        session: { connect: { id: sessionId } },
        
        
        amount: 100,
        status: 'LOCKED'
      }
    });

    // Take tokens from student
    await prisma.user.update({
      where: { id: studentId },
      data: { tokenBalance: { decrement: 100 } } // 200 -> 100
    });

    // Dispute record
    const dispute = await prisma.dispute.create({
      data: {
        session: { connect: { id: sessionId } },
        raisedBy: { connect: { id: studentId } },
        reason: 'Mentor joined late',
        status: 'OPEN'
      }
    });
    disputeId = dispute.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Admin Role Guard', () => {
    it('should reject non-admin users from accessing /admin/stats', async () => {
      await request(app.getHttpServer())
        .get('/admin/stats')
        .set('Authorization', 'Bearer ' + studentToken)
        .expect(403);
    });

    it('should allow admin users to access /admin/stats', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/stats')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200);

      expect(res.body).toHaveProperty('totalUsers');
      expect(res.body).toHaveProperty('dailyActiveUsers');
    });
    
    it('should fetch users list', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Ban User Action (Cascading)', () => {
    it('should allow admin to ban a user and trigger cascade cancellations', async () => {
      // Setup a pending session for the mentor
      const pendingSession = await prisma.session.create({
        data: {
          studentId, mentorId, skillId: (await prisma.skill.findFirst()).id,
          status: 'PENDING', startTime: new Date(), endTime: new Date(Date.now() + 3600), 
        }
      });
      await prisma.escrow.create({
        data: { session: { connect: { id: pendingSession.id } }, amount: 50, status: 'LOCKED' }
      });
      
      const preBanStudent = await prisma.user.findUnique({ where: { id: studentId }}); // 100

      // Ban the mentor
      await request(app.getHttpServer())
        .post('/admin/users/' + mentorId + '/ban')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(201);

      // Verify mentor is banned
      const bannedMentor = await prisma.user.findUnique({ where: { id: mentorId }});
      expect(bannedMentor.isBanned).toBe(true);

      // Verify pending session cancelled
      const cancelledSession = await prisma.session.findUnique({ where: { id: pendingSession.id }});
      expect(cancelledSession.status).toBe('CANCELLED');

      // Verify escrow refunded
      const refundedEscrow = await prisma.escrow.findUnique({ where: { sessionId: pendingSession.id }});
      expect(refundedEscrow.status).toBe('REFUNDED');

      // Unban for dispute test
      await prisma.user.update({ where: { id: mentorId }, data: { isBanned: false } });
    });
  });

  describe('Disputes Resolution Math', () => {
    it('should correctly calculate and apply SPLIT resolution', async () => {
      // student balance currently 100.
      // mentor balance currently 50.
      // Escrow is 100.
      // SPLIT: Tax is 5. Remaining 95. Mentor gets 47. Student gets 48.
      
      await request(app.getHttpServer())
        .post('/admin/disputes/' + sessionId + '/resolve')
        .send({ decision: 'SPLIT', adminNotes: 'Both parties are at fault here so splitting.' })
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(201);
      
      const resolvedDispute = await prisma.dispute.findUnique({ where: { id: disputeId }});
      expect(resolvedDispute.status).toBe('RESOLVED');
      expect(resolvedDispute.decision).toBe('SPLIT');

      // Let's check the transactions that were created
      const studentTx = await prisma.transaction.findFirst({ where: { toUserId: studentId, referenceId: sessionId, type: 'ESCROW_RELEASE' }});
      expect(studentTx.amount).toBe(48);

      const mentorTx = await prisma.transaction.findFirst({ where: { toUserId: mentorId, referenceId: sessionId, type: 'ESCROW_RELEASE' }});
      expect(mentorTx.amount).toBe(47);

      const adminTx = await prisma.transaction.findFirst({ where: { toUserId: adminId, referenceId: sessionId, type: 'TAX' }});
      expect(adminTx.amount).toBe(5);
    });
  });
});

