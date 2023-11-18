import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('api/v1')
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
