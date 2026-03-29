import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { LedgerService } from '../ledger/ledger.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private ledger: LedgerService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('User with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          tokenBalance: 50, // Set initial balance
        },
      });

      // Record the initial credit in the transaction ledger
      await tx.transaction.create({
        data: {
          toUserId: user.id,
          amount: 50,
          type: TransactionType.EARN,
          status: 'COMPLETED',
        }
      });

      const { accessToken, refreshToken } = await this.generateTokens(user.id, user.role);
      
      const { passwordHash: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, accessToken, refreshToken };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (user.isBanned) throw new UnauthorizedException('Your account has been suspended');

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.role);
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'super_secret_access_key',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tokenBalance: true,
        reputationScore: true,
        isVerified: true,
        teachingStreak: true,
      }
    });
    return user;
  }
}
