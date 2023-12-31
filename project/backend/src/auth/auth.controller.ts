import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  Response,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AuthType } from '@prisma/client';
import { IsString, Matches } from 'class-validator';
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
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{6,12}$/, {
    message:
      '닉네임은 6-12자의 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.',
  })
  nickname!: string;

  @ApiProperty({ description: '프로필 이미지 주소' })
  @IsString()
  imageUrl!: string;
}

class TwoFactorAuthenticationBody {
  @ApiProperty()
  password!: string;
}

@Controller('/api/auth')
export class AuthController {
  private logger = new Logger('authContoller');
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
    const jwtPayload = await this.authService.oauth42(req.user);
    this.setCookie(res, jwtPayload);
    this.logger.debug(`oauth42 코드 jwtPayload ${JSON.stringify(jwtPayload)}`);
    switch (jwtPayload['phase']) {
      case 'register':
        this.logger.debug('리다이렉트 => /sign-in');
        res.redirect('/sign-in');
        break;
      case '2fa':
        this.logger.debug('리다이렉트 => /2fa');
        res.redirect('/2fa');
        break;
      case 'complete':
        this.logger.debug('리다이렉트 => welcome => /friend');
        this.welcome(res, 'FT');
        break;
    }
  }

  @ApiOperation({ summary: '회원 가입 요청' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('register')
  @Post('register')
  async register(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Body() data: RegisterBody,
  ) {
    const logger = new Logger('Post register');
    const { type, id } = req.user as JwtPayloadPhaseRegister;
    try {
      const jwtPayload = await this.authService.register(
        type,
        id,
        data.nickname,
        data.imageUrl,
      );
      logger.debug(`jwtPayLoad: ${jwtPayload}`);
      this.setCookie(res, jwtPayload);
      logger.debug('res.redirect2 => welcome => /friend');
      logger.debug('return jwtPayload');
      return jwtPayload;
    } catch (error) {
      logger.error(error);
      throw new BadRequestException(`가입 실패: ${error}`);
    }
  }

  @ApiOperation({ summary: '2FA 로그인 용' })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 Jwt 토큰' })
  @ApiForbiddenResponse({ description: 'Jwt의 Phase가 2fa가 아닙니다.' })
  @ApiUnprocessableEntityResponse({
    description: '2차 인증 비밀번호가 일치하지 않습니다.',
  })
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
    if (!jwtPayload) {
      throw new UnprocessableEntityException(
        '2차 인증 비밀번호가 일치하지 않습니다.',
      );
    }
    this.setCookie(res, jwtPayload);
    this.welcome(res, type);
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
