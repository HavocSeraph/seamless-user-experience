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

  // Public endpoint for testing Phase 4
  @Get('test-token/:sessionId')
  async getTestToken(@Param('sessionId') sessionId: string) {
    // Generate JWT access token strictly for testing without needing DB
    const randomUserId = `test-user-${Math.floor(Math.random() * 1000)}`;
    const { AccessToken } = require('livekit-server-sdk');
    
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY || 'APIZtuvW3iws6Ct',
      process.env.LIVEKIT_API_SECRET || '9VpAAvJo4hGcsKzydvyocJOMQUewX6mNlLfyl9t8o1e',
      {
        identity: randomUserId,
        name: randomUserId,
      },
    );
    at.addGrant({ roomJoin: true, room: `session-${sessionId}` });
    
    const jwtToken = await at.toJwt();
    return { token: jwtToken };
  }
}
