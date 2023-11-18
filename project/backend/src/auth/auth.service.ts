import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';

import { PrismaService } from '../base/prisma.service';
import { UserId, idOf } from '../common/Id';

export interface JwtPayload {
  userId: UserId;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(user: any): Promise<string> {
    const metadataJson = JSON.stringify(user._json);
    const prismaAuth = await this.prismaService.auth.upsert({
      where: { type_id: { type: 'FT', id: user.id } },
      create: {
        type: 'FT',
        id: user.id,
        metadataJson,
        user: { create: { nickname: `new user ${v4()}` } },
      },
      update: { metadataJson },
    });
    const payload: JwtPayload = { userId: idOf(prismaAuth.userId) };
    return this.jwtService.sign(payload);
  }
}
