import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LivekitService {
  constructor(private prisma: PrismaService) {}

  async generateToken(sessionId: string, userId: string, userName: string): Promise<string> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');

    // Ensure the participant belongs to the specific session
    if (session.studentId !== userId && session.mentorId !== userId) {
      throw new ForbiddenException('You are not authorized to join this room.');
    }

    const now = new Date();
    const tenMinutesBefore = new Date(session.startTime.getTime() - 10 * 60000);
    
    if (now < tenMinutesBefore) {
      throw new ForbiddenException('Room is not yet open. You can join 10 minutes before start time.');
    }

    const roomName = `session-${sessionId}`;

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY || 'devkey',
      process.env.LIVEKIT_API_SECRET || 'secret',
      {
        identity: userId,
        name: userName,
      },
    );

    at.addGrant({ roomJoin: true, room: roomName });

    // Link the room to the session if it hasn't been yet
    if (!session.livekitRoomId) {
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { livekitRoomId: roomName },
      });
    }

    return await at.toJwt();
  }
}
