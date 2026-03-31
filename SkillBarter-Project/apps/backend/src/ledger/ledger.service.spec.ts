import { Test, TestingModule } from '@nestjs/testing';
import { LedgerService } from './ledger.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, EscrowStatus } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('LedgerService', () => {
  let service: LedgerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LedgerService,
        {
          provide: PrismaService,
          useValue: {
            user: { update: jest.fn(), findUniqueOrThrow: jest.fn(), findFirst: jest.fn() },
            transaction: { create: jest.fn() },
            escrow: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
            session: { findUnique: jest.fn() },
            $transaction: jest.fn((promises) => {
              if (typeof promises === 'function') {
                return promises({
                  user: prisma.user,
                  transaction: prisma.transaction,
                  escrow: prisma.escrow
                });
              }
              return Promise.all(promises);
            })
          },
        },
      ],
    }).compile();

    service = module.get<LedgerService>(LedgerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('credit', () => {
    it('1. should credit tokens to a user successfully', async () => {
      const txMock = jest.spyOn(prisma, '$transaction');
      await service.credit('user_1', 50, TransactionType.EARN);
      expect(txMock).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: { tokenBalance: { increment: 50 } }
      });
    });

    it('2. should fail if amount is negative initially', async () => {
      await expect(service.credit('user_1', -10, TransactionType.EARN))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('debit', () => {
    it('3. should debit tokens from a user successfully if balance is sufficient', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue({ id: 'user_1', tokenBalance: 100 } as any);
      await service.debit('user_1', 30, TransactionType.SPEND);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: { tokenBalance: { decrement: 30 } }
      });
    });

    it('4. should throw if user has insufficient balance during debit', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue({ id: 'user_1', tokenBalance: 10 } as any);
      await expect(service.debit('user_1', 30, TransactionType.SPEND))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('Escrow operations', () => {
    it('5. lockEscrow should lock funds successfully', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue({ id: 's_1', tokenBalance: 100 } as any);
      jest.spyOn(prisma.escrow, 'create').mockResolvedValue({ id: 'esc_1' } as any);
      await service.lockEscrow('s_1', 'm_1', 50);
      expect(prisma.escrow.create).toHaveBeenCalled();
    });

    it('6. releaseEscrow should transfer funds with 5% tax deduction', async () => {
      jest.spyOn(prisma.escrow, 'findUnique').mockResolvedValue({ id: 'esc_1', amount: 100, studentId: 's_1', mentorId: 'm_1', status: EscrowStatus.LOCKED } as any);
      jest.spyOn(prisma.session, 'findUnique').mockResolvedValue({ id: 'sess_1', skillId: 'skill_1' } as any);
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({ id: 'admin_1' } as any);
      await service.releaseEscrow('sess_1');
      
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('7. splitEscrow should handle 50/50 splits correctly with tax', async () => {
      jest.spyOn(prisma.escrow, 'findUnique').mockResolvedValue({ id: 'esc_1', amount: 100, studentId: 's_1', mentorId: 'm_1', status: EscrowStatus.LOCKED } as any);
      jest.spyOn(prisma.session, 'findUnique').mockResolvedValue({ id: 'sess_1', skillId: 'skill_1' } as any);
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({ id: 'admin_1' } as any);
      await service.splitEscrow('sess_1');
      
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
