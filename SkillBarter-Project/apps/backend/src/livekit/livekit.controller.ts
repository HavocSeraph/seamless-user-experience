import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Get('token/:sessionId')
  @UseGuards(AuthGuard('jwt'))
  async getToken(@Request() req, @Param('sessionId') sessionId: string) {
    // Generate JWT access token for WebRTC connection
    const token = await this.livekitService.generateToken(sessionId, req.user.id, req.user.email);
    return { token };
  }
}
