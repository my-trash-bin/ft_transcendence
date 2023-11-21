import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { idOf } from '../common/Id';
import { PongSeasonLogService } from '../pong-season-log/pong-season-log.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NicknameCheckUserDto } from './dto/nickname-check-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  RecordDto,
  RelationStatus,
  UserProfileDto,
} from './dto/user-profile.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

class UniqueCheckResponse {
  @ApiProperty({ description: '유니크 여부', type: Boolean })
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

  @Get()
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiOkResponse({
    description: '모든 유저 객체리스트 반환.',
    type: () => UserDto,
    isArray: true,
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 1명 기본 조회' })
  @ApiOkResponse({ description: '유저 객체 하나 반환', type: () => UserDto })
  @ApiBadRequestResponse({ description: '올바르지 않은 id' })
  findOne(@Param('id') id: string) {
    const result = this.usersService.findOne(idOf(id));
    if (result === null) {
      throw new BadRequestException('올바르지 않은 id');
    }
    return result;
  }

  @Post()
  @ApiOperation({
    summary: '유저 생성. 사실 아직 이 테이블의 정확한 기능을 잘...',
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: () => UserDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiConflictResponse({ description: 'Conflict.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '유저의 닉네임/프로필이미지링크 변경' })
  @ApiOkResponse({
    description: '유저 정보 변경 요청 성공(변경 사항 없는 요청 포함)',
    type: () => UserDto,
  })
  @ApiBadRequestResponse({ description: '관계키 오류' })
  @ApiConflictResponse({ description: '닉네임 유니크 조건 오류' })
  @ApiInternalServerErrorResponse({ description: '알수 없는 내부 에러' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(idOf(id), updateUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.getResponse(), HttpStatus.CONFLICT);
      }
      if (error instanceof BadRequestException) {
        throw new HttpException(error.getResponse(), HttpStatus.BAD_REQUEST);
      }
      // 다른 예외에 대한 처리
      throw new HttpException('서버 오류', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Post('unique-check')
  @ApiOperation({ summary: '닉네임 유니크 여부 체크' })
  @ApiOkResponse({
    description: '성공적인 유니크 여부 체크. 유니크 여부 반환',
    type: () => UniqueCheckResponse,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
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
  @ApiOperation({ summary: '프로필 데이터를 위한 유저 조회' })
  @ApiOkResponse({
    description: '유저 1명의 프로필을 위한 데이터 반환',
    type: () => UserProfileDto,
  })
  @ApiBadRequestResponse({ description: '유효하지 않은 ID' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  async getUserInfo(
    @Query('targetUser') targetUserId: string,
    @Request() req: ExpressRequest,
  ): Promise<UserProfileDto> {
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

    return new UserProfileDto({
      imageUrl: targetUser.profileImageUrl,
      nickname: targetUser.nickname,
      record: new RecordDto(record),
      relation,
      statusMessage: 'User 모델에 필드 추가해야함',
    });
  }
  private async getRelation(
    followerId: string,
    follweeId: string,
  ): Promise<RelationStatus> {
    if (followerId === follweeId) {
      return RelationStatus.Me;
    }
    const friendship = await this.userFollowService.findOne(
      idOf(followerId),
      idOf(follweeId),
    );
    if (friendship === null) {
      return RelationStatus.None;
    }
    return friendship.isBlock ? RelationStatus.Block : RelationStatus.Friend;
  }
}