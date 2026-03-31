import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('WalletController', () => {
  let controller: WalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            transaction: {
              aggregate: jest.fn(),
            },
            session: {
              count: jest.fn(),
            },
            bountyAnswer: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
