import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayload, JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf, UserId } from '../common/Id';
import { PongLogService } from '../pong-log/pong-log.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { NicknameCheckUserDto } from './dto/nickname-check-user.dto';
import { TwoFactorPasswordDto } from './dto/two-factor-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  RecordDto,
  RelationStatus,
  UserProfileDto,
} from './dto/user-profile.dto';
import { UserRelationshipDto } from './dto/user-relationship.dto';
import {
  FindOneParam,
  GetUserQuery,
  GetUsetByNicknameParam,
  SearchByNicknameQuery,
} from './dto/user-request.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

class UniqueCheckResponse {
  @ApiProperty({ description: '유니크 여부', type: Boolean })
  isUnique!: boolean;
}

@ApiTags('users')
@Controller('/api/v1/users')
export class UsersController {
  private logger = new Logger('userController');
  constructor(
    private readonly usersService: UsersService,
    private readonly userFollowService: UserFollowService,
    private readonly pongLogService: PongLogService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: '내 정보' })
  @ApiOkResponse({
    type: () => ({ phase: String, id: String, me: Object }),
  })
  @UseGuards(JwtGuard)
  async myProfile(@Request() req: ExpressRequest) {
    const { phase, id } = req.user as JwtPayload;

    if (phase !== 'complete') {
      return {
        phase,
        id: id as string,
      };
    }

    const userId = id as UserId;
    const me = await this.usersService.me(userId); // 본인, 타인 통합인듯

    return {
      phase,
      id: (id as UserId).value,
      me,
    };
  }

  @Get()
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiOkResponse({
    description: '모든 유저 객체리스트 반환.',
    type: () => UserDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: '닉네임 기반 유저 검색' })
  @ApiOkResponse({
    description: '일치하는 유저 객체리스트 반환.',
    type: () => UserRelationshipDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async searchByNickname(
    @Request() req: ExpressRequest,
    @Query() query: SearchByNicknameQuery,
  ) {
    const { q: nickname } = query;
    console.log('complete', nickname, req.user);
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    return await this.usersService.searchByBickname(userId, nickname);
  }

  @Get('profile')
  @ApiOperation({ summary: '프로필 데이터를 위한 유저 조회' })
  @ApiOkResponse({
    description: '유저 1명의 프로필을 위한 데이터 반환',
    type: () => UserProfileDto,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @ApiBadRequestResponse({ description: '유효하지 않은 ID' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  async getUserInfo(
    @Query() query: GetUserQuery,
    @Request() req: ExpressRequest,
  ): Promise<UserProfileDto> {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const { targetUser: targetUserId } = query;
    const targetUser = await this.usersService.findOne(idOf(targetUserId)); // 본인, 타인 통합인듯

    if (targetUser === null) {
      throw new NotFoundException('Invalid Id. (targetUser)');
    }
    const relation = await this.getRelation(userId.value, targetUserId);
    const userLogs = await this.pongLogService.findOneByUserId(
      idOf(targetUserId),
    );

    const record = {
      win: userLogs.wins,
      lose: userLogs.losses,
      ratio: userLogs.winRate,
    };

    return new UserProfileDto({
      id: idOf(targetUserId),
      imageUrl: targetUser.profileImageUrl,
      nickname: targetUser.nickname,
      record: new RecordDto(record),
      relation,
      statusMessage: targetUser.statusMessage,
    });
  }

  @Get('nickname/:nickname')
  @ApiOperation({ summary: '유저 1명 기본 조회 by 닉네임' })
  @ApiOkResponse({ description: '유저 객체 하나 반환', type: () => UserDto })
  @ApiBadRequestResponse({ description: '올바르지 않은 닉네임' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async getUsetByNickname(
    @Param() param: GetUsetByNicknameParam,
  ): Promise<UserDto> {
    const { nickname } = param;
    console.log(`nickname : ${nickname}`);
    const result = await this.usersService.findOneByNickname(nickname);
    if (result === null) {
      throw new BadRequestException(`올바르지 않은 닉네임: ${nickname}`);
    }
    return result;
  }

  @Post('set-2fa')
  @ApiOperation({ summary: '2차 인증 비밀번호 설정' })
  @ApiCreatedResponse({ description: '2차 인증 비밀번호 설정 성공, 반환값 X' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  @ApiBadRequestResponse({ description: '유효하지 않은 비밀번호' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async setTwoFactorPassword(
    @Request() req: ExpressRequest,
    @Body() dto: TwoFactorPasswordDto,
  ) {
    // 닉네임 중복 체크 로직 구현
    const { id } = req.user as JwtPayloadPhaseComplete;
    const { password } = dto;
    this.logger.debug(id, password);
    await this.usersService.setTwoFactorPassword(id, password);
  }

  @Post('unset-2fa')
  @ApiOperation({ summary: '2차 인증 비밀번호 해제' })
  @ApiCreatedResponse({
    description: '2차 인증 비밀번호 설정 해제 성공, 반환값 X',
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async unsetTwoFactorPassword(@Request() req: ExpressRequest) {
    // 닉네임 중복 체크 로직 구현
    const { id } = req.user as JwtPayloadPhaseComplete;
    await this.usersService.unsetTwoFactorPassword(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 1명 기본 조회' })
  @ApiOkResponse({ description: '유저 객체 하나 반환', type: () => UserDto })
  @ApiBadRequestResponse({ description: '올바르지 않은 id' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findOne(@Param() param: FindOneParam) {
    const { id } = param;
    console.log(`findOne: ${id}`);
    const result = await this.usersService.findOne(idOf(id));
    if (result === null) {
      throw new BadRequestException('올바르지 않은 id');
    }
    return result;
  }

  @Patch()
  @ApiOperation({ summary: '유저의 닉네임/프로필이미지링크 변경' })
  @ApiOkResponse({
    description: '유저 정보 변경 요청 성공(변경 사항 없는 요청 포함)',
    type: () => UserDto,
  })
  @ApiBadRequestResponse({ description: '관계키 오류' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  @ApiConflictResponse({ description: '닉네임 유니크 조건 오류' })
  @ApiInternalServerErrorResponse({ description: '알수 없는 내부 에러' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async update(
    @Request() request: ExpressRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = request.user as JwtPayloadPhaseComplete;
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Post('unique-check')
  @ApiOperation({ summary: '닉네임 유니크 여부 체크' })
  @ApiOkResponse({
    description: '성공적인 유니크 여부 체크. 유니크 여부 반환',
    type: () => UniqueCheckResponse,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 유저로부터의 요청.' })
  // @ApiResponse({ status: 409, description: 'Nickname already exists.' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('register')
  async checkNickname(
    @Body() dto: NicknameCheckUserDto,
  ): Promise<UniqueCheckResponse> {
    // 닉네임 중복 체크 로직 구현
    const { nickname } = dto;
    const isUnique = await this.usersService.isUniqueNickname(nickname);
    return { isUnique };
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
