import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Achievement } from '@prisma/client';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { AchievementService } from './achievement.service';
import { AchievementDto } from './dto/achievement.dto';
import { UserAchievementDto } from './dto/user-achievement.dto';

@ApiTags('achievement')
@Controller('/api/v1/achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  @ApiOperation({ summary: '모든 achievement 리턴' })
  @ApiOkResponse({
    description: '모든 achievement 리턴',
    type: () => AchievementDto,
    isArray: true,
  })
  async findAll(): Promise<Achievement[]> {
    return await this.achievementService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'user가 획득한 achievement 리턴' })
  @ApiOkResponse({
    description: '모든 achievement 리턴',
    type: () => UserAchievementDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 유저만 조회 가능',
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<UserAchievementDto[]> {
    return await this.achievementService.findByUser(idOf(userId));
  }
}
