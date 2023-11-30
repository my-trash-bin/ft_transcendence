import { scrypt } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthType } from '@prisma/client';

import { PrismaService } from '../base/prisma.service';
import { idOf, UserId } from '../common/Id';

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
    // console.log('ftUser'); // 프로필임
    // console.log(ftUser);
    /*
    id: '104048', 유니크값
    username: 'hyeonjan',
    displayName: 'Hyeonjun Jang',
    name: { familyName: 'Jang', givenName: 'Hyeonjun' },
    profileUrl: 'https://api.intra.42.fr/v2/users/hyeonjan',
    emails: [ { value: 'hyeonjan@student.42seoul.kr' } ],
    phoneNumbers: [ { value: 'hidden' } ],
    photos: [ { value: undefined } ],
    provider: '42',
    */
    const metadataJson = ftUser._raw;
    return await this.prismaService.$transaction(
      // 첫번째 async
      async (tx): Promise<JwtPayload> => {
        // Auth 모델 테이블
        const auth = await tx.auth.findUnique({
          where: { type_id: { type: 'FT', id: ftUser.id } },
          select: { userId: true },
        });
        if (!auth) {
          // 1. auth 처음 가입
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
            // 2. 2FA 설정된 상태
            return { phase: '2fa', type, id };
          } else if (!user) {
            // 구분 잘 안됨
            return { phase: 'register', type, id };
          } else {
            // 3. 통과
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
        // TODO: AuthUser 하나당 한개의 유저를 바란다면 여기서 막으면 된다.
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
