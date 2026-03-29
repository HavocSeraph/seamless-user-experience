import { Controller, Get, Request, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  async getMyTransactions(@Request() req, @Query('page') page = '1', @Query('limit') limit = '20', @Query('type') type?: string) {
    const userId = req.user.id;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = Math.min(parseInt(limit) || 20, 100);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {
      OR: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    };

    if (type) {
      whereClause.type = type;
    }

    const total = await this.prisma.transaction.count({ where: whereClause });
    const data = await this.prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNumber
    });

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber
    };
  }
}

