import { Controller, Get, Post, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get('stats')
  @Roles('ADMIN')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @Roles('ADMIN')
  async getUsers(@Query('search') search?: string) {
    return this.adminService.getUsers(search);
  }

  @Post('users/:id/ban')
  @Roles('ADMIN')
  async banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }
}
