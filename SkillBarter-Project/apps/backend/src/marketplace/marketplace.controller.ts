import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private prisma: PrismaService) {}

  @Get('search')
  async searchSkills(
    @Query('q') q: string,
    @Query('category') category: string,
    @Query('level') level: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    if (q) {
      // Full Text Search with tsquery mapped to Postgres search_vector
      const formattedQuery = q.split(' ').map(term => term + ':*').join(' | ');
      
      const skills = await this.prisma.$queryRawUnsafe(`
        SELECT s.*, u.name as "teacherName", u."reputationScore" 
        FROM "Skill" s
        JOIN "User" u ON s."userId" = u.id
        WHERE s."isActive" = true
        AND s.search_vector @@ to_tsquery('english', $1)
        ${category ? 'AND s.category = $2' : ''}
        ${level ? 'AND s.level = $3' : ''}
        ${minPrice ? 'AND s."priceCoins" >= $4' : ''}
        ${maxPrice ? 'AND s."priceCoins" <= $5' : ''}
        ORDER BY ts_rank(s.search_vector, to_tsquery('english', $1)) DESC
        LIMIT $6 OFFSET $7
      `, formattedQuery, 
         category || null, 
         level || null, 
         minPrice ? parseInt(minPrice) : null, 
         maxPrice ? parseInt(maxPrice) : null, 
         limitNumber, 
         skip);
      
      return skills;
    } else {
      // Standard Prisma findMany if no search query
      const whereClause: any = { isActive: true };
      if (category) whereClause.category = category;
      if (level) whereClause.level = level;
      if (minPrice || maxPrice) {
        whereClause.priceCoins = {};
        if (minPrice) whereClause.priceCoins.gte = parseInt(minPrice, 10);
        if (maxPrice) whereClause.priceCoins.lte = parseInt(maxPrice, 10);
      }

      const skills = await this.prisma.skill.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, email: true, reputationScore: true } }
        },
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' }
      });
      return skills;
    }
  }

  @Get('categories')
  async getCategories() {
    return this.prisma.skill.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { _count: { category: 'desc' } }
    });
  }
}
