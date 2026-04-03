import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/disputes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  async getDisputes() {
    return this.disputesService.getDisputes();
  }

  @Post(':id/resolve')
  async resolveDispute(
    @Param('id') id: string,
    @Body('decision') decision: 'REFUND_TO_STUDENT' | 'RELEASE_TO_MENTOR' | 'SPLIT',
    @Body('adminNotes') adminNotes: string
  ) {
    return this.disputesService.resolveDispute(id, decision, adminNotes);
  }
}
