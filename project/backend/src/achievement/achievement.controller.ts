import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WsException } from '@nestjs/websockets';
import { Request as ExpressRequset } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { AchievementService } from './achievement.service';
import { GrantAchievementDto } from './dto/achievement-request.dto';
import { AchievementWithReceived } from './dto/achievement-with-received.dto';
@ApiTags('achievement')
@Controller('/api/v1/achievement')
export class AchievementController {
  private logger = new Logger('AchievementController');
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @ApiOperation({ summary: '사용자의 achievement 획득 정보 리턴' })
  @ApiOkResponse({
    type: () => AchievementWithReceived,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findAll(
    @Req() req: ExpressRequset,
  ): Promise<AchievementWithReceived[]> {
    const { id } = req.user as JwtPayloadPhaseComplete;
    const result = await this.achievementService.findAllWithReceived(id);
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }
    return result.data!;
  }

  // @Get()
  // @ApiOperation({ summary: '모든 achievement 리턴' })
  // @ApiOkResponse({
  //   description: '모든 achievement 리턴',
  //   type: () => AchievementDto,
  //   isArray: true,
  // })
  // async findAll(): Promise<Achievement[]> {
  //   return await this.achievementService.findAll();
  // }

  // @Get(':userId')
  // @ApiOperation({ summary: 'user가 획득한 achievement 리턴' })
  // @ApiOkResponse({
  //   description: '모든 achievement 리턴',
  //   type: () => UserAchievementDto,
  //   isArray: true,
  // })
  // @ApiUnauthorizedResponse({
  //   description: '로그인 유저만 조회 가능',
  // })
  // @UseGuards(JwtGuard, PhaseGuard)
  // @Phase('complete')
  // async findByUser(
  //   @Param('userId') userId: string,
  // ): Promise<UserAchievementDto[]> {
  //   return await this.achievementService.findByUser(idOf(userId));
  // }

  // TODO: 테스트 용도, 삭제 OR 주석처리
  @Post()
  @ApiOperation({ summary: 'user에게 업적 부여' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async grantAchievement(@Body() dto: GrantAchievementDto) {
    const { title, userId } = dto;

    const result = await this.achievementService.grantAchievement(
      idOf(userId),
      title,
    );

    if (!result.ok) {
      throw result.error!;
    }

    return result.data!;
  }
}
