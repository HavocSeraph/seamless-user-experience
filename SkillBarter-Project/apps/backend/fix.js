const fs = require('fs');
const content = `import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('skills')
export class SkillsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSkill(@Request() req, @Body() body: any) {
    const skill = await this.prisma.skill.create({
      data: {
        userId: req.user.id,
        title: body.title,
        description: body.description,
        category: body.category,
        level: body.level,
        priceCoins: body.priceCoins
      }
    });

    try {
      await this.prisma.$executeRaw\`
        UPDATE "Skill" 
        SET search_vector = to_tsvector('english', title || ' ' || description || ' ' || category)
        WHERE id = \${skill.id}::uuid
      \`;
    } catch (e) {}

    return skill;
  }

  @Get(':id')
  async getSkill(@Param('id') id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, reputationScore: true, teachingStreak: true, githubId: true } },
        sessions: { take: 5 }
      }
    });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateSkill(@Request() req, @Param('id') id: string, @Body() body: any) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    if (skill.userId !== req.user.id) throw new ForbiddenException('You do not own this skill');

    const updated = await this.prisma.skill.update({
      where: { id },
      data: { ...body }
    });

    try {
      await this.prisma.$executeRaw\`
        UPDATE "Skill"
        SET search_vector = to_tsvector('english', title || ' ' || description || ' ' || category)
        WHERE id = \${updated.id}::uuid
      \`;
    } catch(e) {}

    return updated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteSkill(@Request() req, @Param('id') id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    if (skill.userId !== req.user.id) throw new ForbiddenException('You do not own this skill');

    return this.prisma.skill.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
`;
fs.writeFileSync('src/skills/skills.controller.ts', content, 'utf8');
