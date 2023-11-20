import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { idOf } from '../common/Id';
import { PongSeasonLogService } from '../pong-season-log/pong-season-log.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NicknameCheckUserDto } from './dto/nickname-check-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
// {
// 	nickname : string,
// 	imageUrl : string,
// 	record : {
// 		win : int,
// 		lose : int,
// 		ratio : int,
// 	}
// 	statusMessage : string,
// 	relation: 'friend' // or 'block' or 'none' or 'me'
// }

class UserProfileResponse {
  nickname!: string;
  imageUrl!: string | null;
  record!: {
    win: number;
    lose: number;
    ratio: number;
  };
  statusMessage!: string;
  relation!: 'friend' | 'block' | 'none' | 'me';
}

class UniqueCheckResponse {
  isUnique!: boolean;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userFollowService: UserFollowService,
    private readonly pongSeasonLogService: PongSeasonLogService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Conflict.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(idOf(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(idOf(id), updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Post('unique-check')
  @ApiResponse({ status: 200, description: 'Nickname check request accepted.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  @ApiResponse({ status: 403, description: 'forbidden.' })
  // @ApiResponse({ status: 409, description: 'Nickname already exists.' })
  async checkNickname(
    @Body() dto: NicknameCheckUserDto,
  ): Promise<UniqueCheckResponse> {
    // 닉네임 중복 체크 로직 구현
    const { nickname } = dto;
    const isUnique = await this.usersService.isUniqueNickname(nickname);
    return { isUnique };
  }

  @Get('profile')
  async getUserInfo(
    @Query('targetUser') targetUserId: string,
    @Request() req: ExpressRequest,
  ): Promise<UserProfileResponse> {
    const userId = (req.user as JwtPayloadPhaseComplete).id;

    const targetUser = await this.usersService.findOne(idOf(targetUserId)); // 본인, 타인 통합인듯

    if (targetUser === null) {
      throw new NotFoundException('Invalid Id. (targetUser)');
    }
    const relation = await this.getRelation(userId.value, targetUserId);

    const seasonLog = await this.pongSeasonLogService.findOne(
      idOf(targetUserId),
    );
    const record = {
      win: seasonLog.win,
      lose: seasonLog.lose,
      ratio: seasonLog.winRate,
    };

    return {
      imageUrl: targetUser.profileImageUrl,
      nickname: targetUser.nickname,
      record,
      relation,
      statusMessage: 'User 모델에 필드 추가해야함',
    };
  }
  private async getRelation(
    followerId: string,
    follweeId: string,
  ): Promise<'friend' | 'block' | 'none' | 'me'> {
    if (followerId === follweeId) {
      return 'me';
    }
    const friendship = await this.userFollowService.findOne(
      idOf(followerId),
      idOf(follweeId),
    );
    if (friendship === null) {
      return 'none';
    }
    return friendship.isBlock ? 'block' : 'friend';
  }
}
// {
// 	nickname : string,
// 	imageUrl : string,
// 	record : {
// 		win : int,
// 		lose : int,
// 		ratio : int,
// 	}
// 	statusMessage : string,
// 	relation: 'friend' // or 'block' or 'none' or 'me'
// }
