import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { UserId } from '../common/Id';

class MeResult {
  @ApiProperty()
  value: string;

  constructor(id: UserId) {
    this.value = id.value;
  }
}

@Controller('api/v1')
export class AppController {
  constructor(private authService: AuthService) {}

  // TODO: apply https://docs.nestjs.com/openapi/operations
  @UseGuards(JwtGuard)
  @Get('me')
  @ApiOkResponse({
    type: MeResult,
  })
  getProfile(@Request() req: ExpressRequest) {
    return new MeResult(req.user!.userId);
  }
}
