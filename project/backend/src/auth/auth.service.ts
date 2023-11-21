import { scrypt } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthType } from '@prisma/client';

import { PrismaService } from '../base/prisma.service';
import { UserId, idOf } from '../common/Id';

// After OAuth, if user not exists
export interface JwtPayloadPhaseRegister {
  phase: 'register';
  type: AuthType;
  id: string;
}

// After OAuth, if user exists and 2fa set
export interface JwtPayloadPhase2FA {
  phase: '2fa';
  type: AuthType;
  id: string;
}

export interface JwtPayloadPhaseComplete {
  phase: 'complete';
  id: UserId;
}

export type JwtPayload =
  | JwtPayloadPhaseRegister
  | JwtPayloadPhase2FA
  | JwtPayloadPhaseComplete;

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async oauth42(ftUser: any): Promise<JwtPayload> {
    const metadataJson = ftUser._raw;
    return await this.prismaService.$transaction(
      async (tx): Promise<JwtPayload> => {
        const auth = await tx.auth.findUnique({
          where: { type_id: { type: 'FT', id: ftUser.id } },
          select: { userId: true },
        });
        if (!auth) {
          const { type, id } = await tx.auth.create({
            data: { type: 'FT', id: ftUser.id, metadataJson },
            select: { type: true, id: true },
          });
          return { phase: 'register', type, id };
        } else {
          const { type, id, user } = await tx.auth.update({
            where: { type_id: { type: 'FT', id: ftUser.id } },
            data: { metadataJson },
            select: {
              type: true,
              id: true,
              user: { select: { id: true, mfaPasswordHash: true } },
            },
          });
          if (user?.mfaPasswordHash) {
            return { phase: '2fa', type, id };
          } else if (!user) {
            return { phase: 'register', type, id };
          } else {
            return { phase: 'complete', id: idOf(user.id) };
          }
        }
      },
    );
  }

  async register(
    authType: AuthType,
    authId: string,
    nickname: string,
    imageUrl: string,
  ): Promise<JwtPayload> {
    return await this.prismaService.$transaction(
      async (tx): Promise<JwtPayload> => {
        const auth = await tx.auth.update({
          where: { type_id: { type: authType, id: authId } },
          data: {
            user: {
              create: {
                nickname,
                profileImageUrl: imageUrl,
              },
            },
          },
          select: { user: { select: { id: true } } },
        });
        const { id } = auth!.user!;
        return { phase: 'complete', id: idOf(id) };
      },
    );
  }

  async twoFactorAuthentication(
    authType: AuthType,
    authId: string,
    password: string,
  ): Promise<JwtPayload | undefined> {
    const auth = await this.prismaService.auth.findUnique({
      where: { type_id: { type: authType, id: authId } },
      select: { user: { select: { id: true, mfaPasswordHash: true } } },
    });
    if (
      (await this.mfaPasswordHash(password)) === auth!.user!.mfaPasswordHash
    ) {
      return { phase: 'complete', id: idOf(auth!.user!.id) };
    } else {
      return undefined;
    }
  }

  private mfaPasswordHash(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      scrypt(
        password,
        this.configService.getOrThrow<string>('PASSWORD_SALT'),
        32,
        (err, buffer) => {
          if (err) reject(err);
          else resolve(buffer.toString());
        },
      );
    });
  }
}
