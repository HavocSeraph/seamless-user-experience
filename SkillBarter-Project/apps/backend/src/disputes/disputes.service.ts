import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDisputes() {
    return this.prisma.dispute.findMany({
      where: { status: 'OPEN' },
      include: {
        session: {
          include: {
            student: { select: { email: true } },
            mentor: { select: { email: true } },
            escrow: true
          }
        },
        raisedBy: { select: { email: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async resolveDispute(id: string, decision: 'REFUND_TO_STUDENT' | 'RELEASE_TO_MENTOR' | 'SPLIT', adminNotes: string) {
    if (!adminNotes || adminNotes.length < 20) {
      throw new BadRequestException('Admin notes must be at least 20 characters');
    }

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({
        where: { id },
        include: { escrow: true, dispute: true }
      });

      if (!session) throw new BadRequestException('Session not found');
      if (session.status !== 'DISPUTED') throw new BadRequestException('Session is not in disputed state');
      if (!session.escrow) throw new BadRequestException('Escrow not found');
      
      const escrow = session.escrow;

      const openDispute = session.dispute;
      if (openDispute && openDispute.status === 'OPEN') {
        await tx.dispute.update({
          where: { id: openDispute.id },
          data: { 
            status: 'RESOLVED', 
            resolvedAt: new Date(),
            decision,
            adminNotes
          }
        });
      }

      const escrowAmount = escrow.amount;

      if (decision === 'REFUND_TO_STUDENT') {
        // Refund
        await tx.user.update({
          where: { id: session.studentId },
          data: { tokenBalance: { increment: escrowAmount } }
        });
        await tx.transaction.create({
          data: {
            toUser: { connect: { id: session.studentId } }, amount: escrowAmount, type: 'ESCROW_RELEASE', status: 'COMPLETED', referenceId: session.id
          }
        });
        await tx.escrow.update({ where: { id: escrow.id }, data: { status: 'REFUNDED' } });
        await tx.session.update({ where: { id }, data: { status: 'CANCELLED' } });

      } else if (decision === 'RELEASE_TO_MENTOR') {
        // Release (Taxed)
        const tax = Math.floor(escrowAmount * 0.05);
        const mentorReceives = escrowAmount - tax;
        
        await tx.user.update({
          where: { id: session.mentorId },
          data: { tokenBalance: { increment: mentorReceives } }
        });
        await tx.transaction.create({
          data: { toUser: { connect: { id: session.mentorId } }, amount: mentorReceives, type: 'ESCROW_RELEASE', status: 'COMPLETED', referenceId: session.id }
        });
        
        // Ensure tax record logic
        const adminUser = await tx.user.findFirst({ where: { role: 'ADMIN' }});
        if (adminUser && tax > 0) {
          await tx.user.update({ where: { id: adminUser.id }, data: { tokenBalance: { increment: tax } } });
          await tx.transaction.create({
            data: { toUser: { connect: { id: adminUser.id } }, amount: tax, type: 'TAX', status: 'COMPLETED', referenceId: session.id }
          });
        }
        
        await tx.escrow.update({ where: { id: escrow.id }, data: { status: 'RELEASED' } });
        await tx.session.update({ where: { id }, data: { status: 'COMPLETED' } });

      } else if (decision === 'SPLIT') {
        // SPLIT logic: Math.floor(escrowAmount * 0.05) tax, then split remaining half to mentor, rest to student
        const tax = Math.floor(escrowAmount * 0.05);
        const remaining = escrowAmount - tax;
        const mentorReceives = Math.floor(remaining / 2);
        const studentReceives = remaining - mentorReceives;
        // Check conservation
        // tax + mentorReceives + studentReceives === escrowAmount

        if (studentReceives > 0) {
          await tx.user.update({ where: { id: session.studentId }, data: { tokenBalance: { increment: studentReceives } } });
          await tx.transaction.create({ data: { toUser: { connect: { id: session.studentId } }, amount: studentReceives, type: 'ESCROW_RELEASE', status: 'COMPLETED', referenceId: session.id } });
        }
        
        if (mentorReceives > 0) {
          await tx.user.update({ where: { id: session.mentorId }, data: { tokenBalance: { increment: mentorReceives } } });
          await tx.transaction.create({ data: { toUser: { connect: { id: session.mentorId } }, amount: mentorReceives, type: 'ESCROW_RELEASE', status: 'COMPLETED', referenceId: session.id } });
        }
        
        const adminUser = await tx.user.findFirst({ where: { role: 'ADMIN' }});
        if (adminUser && tax > 0) {
          await tx.user.update({ where: { id: adminUser.id }, data: { tokenBalance: { increment: tax } } });
          await tx.transaction.create({ data: { toUser: { connect: { id: adminUser.id } }, amount: tax, type: 'TAX', status: 'COMPLETED', referenceId: session.id } });
        }

        await tx.escrow.update({ where: { id: escrow.id }, data: { status: 'RELEASED' } });
        await tx.session.update({ where: { id }, data: { status: 'COMPLETED' } });
      }

      return { success: true };
    });
  }
}

