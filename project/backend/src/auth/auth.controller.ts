import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AuthType } from '@prisma/client';
import {
  AuthService,
  JwtPayload,
  JwtPayloadPhase2FA,
  JwtPayloadPhaseRegister,
} from './auth.service';
import { FtGuard } from './ft.guard';
import { JwtGuard } from './jwt.guard';
import { Phase, PhaseGuard } from './phase.guard';

class RegisterBody {
  // TODO: 입력 validatuion
  @ApiProperty({ description: '유니크 닉네임' })
  nickname!: string;

  @ApiProperty({ description: '프로필 이미지 주소' })
  imageUrl!: string;
}

class TwoFactorAuthenticationBody {
  @ApiProperty()
  password!: string;
}

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('logout')
  async logout(@Response() res: ExpressResponse): Promise<void> {
    res.clearCookie('jwt');
    res.end();
  }

  @ApiOperation({ summary: '42 Oauth 로그인' })
  @UseGuards(FtGuard) // 얘가 있으면 무조건 핑퐁
  @Get('42')
  async login(): Promise<void> {}

  @ApiOperation({ summary: '42 Oauth용 콜백 주소' })
  @UseGuards(FtGuard)
  @Get('42/callback')
  async test(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    console.log('test 진입');
    const jwtPayload = await this.authService.oauth42(req.user);
    this.setCookie(res, jwtPayload);
    // 인증이된거고 => 인증 == 토큰 => 쿠키
    // 리다이렉션 => /regisster
    switch (jwtPayload['phase']) {
      case 'register':
        console.log('프론트/sign-in으로 이동!');
        res.redirect('/sign-in');
        break;
      case '2fa':
        console.log('/2fa 로 가버려');
        res.redirect('/2fa');
        break;
      case 'complete':
        console.log('프론트/friend로 이동!');
        this.welcome(res, 'FT');
        break;
    }
  }

  // TODO: argument validation
  @ApiOperation({ summary: '회원 가입 요청' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('register')
  @Post('register')
  async register(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Body() data: RegisterBody,
  ) {
    console.log('register 진입');
    const { type, id } = req.user as JwtPayloadPhaseRegister;
    const jwtPayload = await this.authService.register(
      type,
      id,
      data.nickname,
      data.imageUrl,
    );
    this.setCookie(res, jwtPayload);
    this.welcome(res, type); // TODO: 이 리다이렉션이 아닌 다른게 필요해보임.
  }

  @ApiOperation({ summary: '2FA 로그인 용' })
  @ApiUnauthorizedResponse({ description: 'incorrect 2fa password' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('2fa')
  @Post('2fa')
  async twoFactorAuthentication(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Body() body: TwoFactorAuthenticationBody,
  ) {
    const { type, id } = req.user as JwtPayloadPhase2FA;
    const jwtPayload = await this.authService.twoFactorAuthentication(
      type,
      id,
      body.password,
    );
    if (jwtPayload) {
      this.setCookie(res, jwtPayload);
      this.welcome(res, type);
    } else {
      res.status(401).end();
    }
  }

  private setCookie(res: ExpressResponse, jwtPayload: JwtPayload) {
    res.cookie('jwt', this.jwtService.sign(jwtPayload), {
      httpOnly: true,
      maxAge: 86400000,
    });
  }

  private welcome(res: ExpressResponse, type: AuthType) {
    switch (type) {
      case 'FT':
        res.redirect('/friend');
    }
  }
}
