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
  ApiProperty,
  ApiPropertyOptional,
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
  JwtPayloadPhaseRegister,
} from './auth.service';
import { FtGuard } from './ft.guard';
import { JwtGuard } from './jwt.guard';
import { Phase, PhaseGuard } from './phase.guard';

class RegisterBody {
  @ApiProperty()
  nickname!: string;

  @ApiPropertyOptional()
  password?: string;
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

  @UseGuards(FtGuard)
  @Get('42')
  async login(): Promise<void> {}

  @UseGuards(FtGuard)
  @Get('42/callback')
  async test(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    const jwtPayload = await this.authService.oauth42(req.user);
    this.setCookie(res, jwtPayload);
    switch (jwtPayload['phase']) {
      case 'register':
        res.redirect('/register');
        break;
      case '2fa':
        res.redirect('/2fa');
        break;
      case 'complete':
        this.welcome(res, 'FT');
        break;
    }
  }

  // TODO: argument validation
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('register')
  @Post('register')
  async register(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Body() data: RegisterBody,
  ) {
    const { type, id } = req.user as JwtPayloadPhaseRegister;
    const jwtPayload = await this.authService.register(
      type,
      id,
      data.nickname,
      data.password,
    );
    this.setCookie(res, jwtPayload);
    this.welcome(res, type);
  }

  @ApiUnauthorizedResponse({ description: 'incorrect 2fa password' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('2fa')
  @Post('2fa')
  async twoFactorAuthentication(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
    @Body() body: TwoFactorAuthenticationBody,
  ) {
    const { type, id } = req.user as JwtPayloadPhaseRegister;
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
        res.redirect('/welcome/42');
    }
  }
}
