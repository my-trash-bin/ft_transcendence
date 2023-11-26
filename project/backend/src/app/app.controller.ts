import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { UserId } from '../common/Id';

class JWTResult {
  @ApiProperty()
  value: string;

  constructor(id: UserId) {
    this.value = id.value;
  }
}

@Controller('api/v1')
export class AppController {
  constructor() {}

  // TODO: apply https://docs.nestjs.com/openapi/operations
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @Get('jwt')
  @ApiOkResponse({
    type: JWTResult,
  })
  getJWT(@Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    return new JWTResult(userId);
  }
}
