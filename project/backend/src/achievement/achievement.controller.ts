import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WsException } from '@nestjs/websockets';
import { Request as ExpressRequset } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { AchievementService } from './achievement.service';
import { AchievementWithReceived } from './dto/achievement-with-received.dto';
@ApiTags('achievement')
@Controller('/api/v1/achievement')
export class AchievementController {
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

  // // 테스트 용도
  // @Post(':userId')
  // @ApiOperation({ summary: 'user에게 업적 부여' })
  // @UseGuards(JwtGuard, PhaseGuard)
  // @Phase('complete')
  // async grantAchievement(@Body() dto: GrantAchievementDto) {
  //   const { title, userId } = dto;
  //   return await this.achievementService.grantAchievement(idOf(userId), title);
  // }
}
