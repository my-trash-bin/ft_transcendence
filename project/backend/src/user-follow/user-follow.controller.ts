import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { TargetUserDto } from './dto/create-user-follow.dto';
import { UserFollowDto } from './dto/user-follow.dto';
import { UserFollowService } from './user-follow.service';

@ApiTags('friends')
@Controller('friends')
export class UserFollowController {
  constructor(private readonly userFollowService: UserFollowService) {}

  @Post('request')
  @ApiOperation({ summary: '유저의 친구 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '친구 추가 성공' })
  async followUser(@Request() req: ExpressRequest, @Body() dto: TargetUserDto) {
    const isBlock = false;
    this.createOrUpdate(req, dto, isBlock);
  }

  @Post('block')
  @ApiOperation({ summary: '유저의 블락 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '블락 추가 성공' })
  async blockUser(@Request() req: ExpressRequest, @Body() dto: TargetUserDto) {
    const isBlock = true;
    this.createOrUpdate(req, dto, isBlock);
  }

  @Post('unfriend')
  @ApiOperation({ summary: '유저의 친구 해제 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '친구 해제 성공' })
  async unfollowUser(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
  ) {
    const isBlock = false;
    this.delete(req, dto, isBlock);
  }

  @Post('unblock')
  @ApiOperation({ summary: '유저의 블락 해제 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '블락 해제 성공' })
  async unBlockUser(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
  ) {
    const isBlock = true;
    this.delete(req, dto, isBlock);
  }

  @Get('')
  @ApiOperation({ summary: '유저의 친구/블락 리스트 조회' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자의 요청' })
  // @ApiForbiddenResponse({ description: '인가되지 않은 사용자의 요청' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '요청자의 친구/블락 리스트',
    type: () => UserFollowDto,
    isArray: true,
  })
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
  async findFriends(@Request() req: ExpressRequest): Promise<UserFollowDto[]> {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const isBlock = false;
    const result = await this.userFollowService.findByUsers(userId, isBlock);
    return result.map((el) => new UserFollowDto(el));
  }

  @Get('blocks')
  @ApiOperation({ summary: '유저의 블락 목록 요청' })
  @ApiOkResponse({
    description: '요청자의 블락 리스트',
    type: () => UserFollowDto,
    isArray: true,
  })
  async findBlocks(@Request() req: ExpressRequest): Promise<UserFollowDto[]> {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const isBlock = true;
    const result = await this.userFollowService.findByUsers(userId, isBlock);
    return result.map((el) => new UserFollowDto(el));
  }

  private async createOrUpdate(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
    isBlock: boolean,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const targetUserId = dto.targetUser;
    return await this.userFollowService.createOrUpdate(
      idOf(userId.value),
      idOf(targetUserId),
      isBlock,
    );
  }

  private async delete(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
    isBlock: boolean,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const targetUserId = dto.targetUser;
    return await this.userFollowService.remove(
      idOf(userId.value),
      idOf(targetUserId),
      isBlock,
    );
  }
}
