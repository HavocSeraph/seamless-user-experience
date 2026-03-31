import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
            },
            session: {
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            escrow: {
              aggregate: jest.fn(),
            },
            dispute: {
              count: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: LedgerService,
          useValue: {
            refundEscrow: jest.fn(),
            releaseEscrow: jest.fn(),
            splitEscrow: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
