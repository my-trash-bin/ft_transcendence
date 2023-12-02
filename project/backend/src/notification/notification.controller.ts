import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { NotificationService } from './notification.service';

import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { CreateNotificationDto } from './dto/notification-request.dto';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('notification')
@Controller('/api/v1/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: '유저에게 알림 하나 생성' })
  @ApiOkResponse({ description: '알림 생성 성공', type: NotificationDto })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async create(@Req() req: ExpressRequest, @Body() dto: CreateNotificationDto) {
    const { id } = req.user as JwtPayloadPhaseComplete;
    const { contentJson } = dto;
    const result = await this.notificationService.create(id, contentJson);
    return result;
  }

  @Get()
  @ApiOperation({ summary: '유저에게 온 알림 전체 확인 및 읽기 on' })
  @ApiOkResponse({
    description: '알림 생성 성공',
    type: NotificationDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findManyAndUpdateRead(@Req() req: ExpressRequest) {
    const { id } = req.user as JwtPayloadPhaseComplete;
    const result = await this.notificationService.findManyAndUpdateRead(id);
    if (!result.ok) {
      throw new HttpException(result.error!.message, result.error!.statusCode);
    }
    return result.data!;
  }
}
