import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { EventsService } from '../events/events.service';
import { NotificationService } from '../notification/notification.service';
import { TargetUserDto } from './dto/create-user-follow.dto';
import { UserFollowDto } from './dto/user-follow.dto';
import { UserFollowService } from './user-follow.service';

@ApiTags('friends')
@Controller('/api/v1/friends')
export class UserFollowController {
  private logger = new Logger('UserFollowController');
  constructor(
    private readonly userFollowService: UserFollowService,
    private readonly notificationService: NotificationService,
    private readonly eventsSerivce: EventsService,
  ) {}

  @Post('request')
  @ApiOperation({ summary: '유저의 친구 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '친구 추가 성공' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async followUser(@Request() req: ExpressRequest, @Body() dto: TargetUserDto) {
    const isBlock = false;
    const result = await this.createOrUpdate(req, dto, isBlock);
    if (!result.ok) {
      throw new BadRequestException(result!.error?.message);
    }
    if (result.data?.isNewRecord!) {
      try {
        const notiData = await this.notificationService.create(
          idOf(dto.targetUser),
          JSON.stringify({
            type: 'newFriend',
            sourceId: (req.user as JwtPayloadPhaseComplete).id.value,
            sourceName: result.data?.follower.nickname!,
          }),
        );
        this.eventsSerivce.noti(idOf(dto.targetUser), notiData);
        this.logger.log(`친구 요청 성공 후, 노티 생성 성공`);
      } catch (error) {
        this.logger.error(`친구 요청 성공 후, 노티 생성시 에러: ${error}`);
      }
    } else {
      this.logger.log(`기존친구에 대한 요청으로, 노티 생성X`);
    }
    return {
      isBlock: result.data?.isBlock!,
      followOrBlockedAt: result.data?.followOrBlockedAt!,
      follower: result.data?.follower!,
      followee: result.data?.followee!,
    };
  }

  @Post('block')
  @ApiOperation({ summary: '유저의 블락 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '블락 추가 성공' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async blockUser(@Request() req: ExpressRequest, @Body() dto: TargetUserDto) {
    const isBlock = true;
    const result = await this.createOrUpdate(req, dto, isBlock);
    if (!result.ok) {
      throw new BadRequestException(result!.error?.message);
    }
    return {
      isBlock: result.data?.isBlock!,
      followOrBlockedAt: result.data?.followOrBlockedAt!,
      follower: result.data?.follower!,
      followee: result.data?.followee!,
    };
  }

  @Post('unfriend')
  @ApiOperation({ summary: '유저의 친구 해제 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '친구 해제 성공' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async unfollowUser(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
  ) {
    const isBlock = false;
    await this.delete(req, dto, isBlock);
  }

  @Post('unblock')
  @ApiOperation({ summary: '유저의 블락 해제 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '블락 해제 성공' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async unBlockUser(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
  ) {
    const isBlock = true;
    await this.delete(req, dto, isBlock);
  }

  @Get('')
  @ApiOperation({ summary: '유저의 친구/블락 리스트 조회' })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자의 요청' })
  // @ApiForbiddenResponse({ description: '인가되지 않은 사용자의 요청' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '요청자의 친구/블락 리스트',
    type: () => UserFollowDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findRelationships(@Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const result = await this.userFollowService.findByUsers(userId);
    return result.map((el) => new UserFollowDto(el));
  }

  @Get('friends')
  @ApiOperation({ summary: '유저의 친구 목록 조회' })
  @ApiOkResponse({
    description: '요청자의 친구 리스트',
    type: () => UserFollowDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findFriends(@Request() req: ExpressRequest): Promise<UserFollowDto[]> {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const isBlock = false;
    const result = await this.userFollowService.findByUsers(userId, isBlock);
    this.logger.log(
      `유저(${userId.value})의 친구 목록 조회 결과: 총 ${result.length}명`,
    );
    return result.map((el) => new UserFollowDto(el));
  }

  @Get('blocks')
  @ApiOperation({ summary: '유저의 블락 목록 요청' })
  @ApiOkResponse({
    description: '요청자의 블락 리스트',
    type: () => UserFollowDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findBlocks(@Request() req: ExpressRequest): Promise<UserFollowDto[]> {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const isBlock = true;
    const result = await this.userFollowService.findByUsers(userId, isBlock);
    this.logger.log(
      `유저(${userId.value})의 차단 목록 조회 결과: 총 ${result.length}명`,
    );
    return result.map((el) => new UserFollowDto(el));
  }

  private async createOrUpdate(
    req: ExpressRequest,
    dto: TargetUserDto,
    isBlock: boolean,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const targetUserId = dto.targetUser;
    if (userId.value === targetUserId) {
      throw new BadRequestException('나 자신을 사랑하거나 미워하지 말자');
    }
    return await this.userFollowService.createOrUpdate(
      idOf(userId.value),
      idOf(targetUserId),
      isBlock,
    );
  }

  private async delete(
    req: ExpressRequest,
    dto: TargetUserDto,
    isBlock: boolean,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const targetUserId = dto.targetUser;
    await this.userFollowService.remove(
      idOf(userId.value),
      idOf(targetUserId),
      isBlock,
    );
  }
}
