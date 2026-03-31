import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BountiesService } from './bounties.service';
import { CreateBountyDto } from './dto/create-bounty.dto';

@Controller('bounties')
@UseGuards(AuthGuard('jwt'))
export class BountiesController {
  constructor(private readonly bountiesService: BountiesService) {}

  @Post()
  async createBounty(@Request() req, @Body() dto: CreateBountyDto) {
    return this.bountiesService.createBounty(req.user.id, dto);
  }
}
