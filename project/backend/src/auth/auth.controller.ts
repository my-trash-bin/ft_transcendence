import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AuthService } from './auth.service';
import { FtGuard } from './ft.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FtGuard)
  @Get('42')
  async login(@Request() req: any) {
    return req.user;
  }

  @UseGuards(FtGuard)
  @Get('42/callback')
  async test(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    res.cookie('jwt', await this.authService.login(req.user), {
      httpOnly: true,
      maxAge: 86400000,
    });
    res.redirect('/welcome/42');
  }
}
