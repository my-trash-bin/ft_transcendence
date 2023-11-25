import {
  BadRequestException,
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
@Controller('/api/v1/friends')
export class UserFollowController {
  constructor(private readonly userFollowService: UserFollowService) {}

  @Post('request')
  @ApiOperation({ summary: '유저의 친구 요청' })
  @ApiResponse({ status: HttpStatus.OK, description: '친구 추가 성공' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async followUser(@Request() req: ExpressRequest, @Body() dto: TargetUserDto) {
    console.log('requset');
    console.log(dto);
    const isBlock = false;
    const result = await this.createOrUpdate(req, dto, isBlock);
    if (!result.ok) {
      throw new BadRequestException(result!.error?.message);
    }
    return result!.data;
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
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
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
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async unBlockUser(
    @Request() req: ExpressRequest,
    @Body() dto: TargetUserDto,
  ) {
    const isBlock = true;
    this.delete(req, dto, isBlock);
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
    console.log('findRelationships', req.user);
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
    console.log('findFriends', req.user);
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    console.log('findFriends2', userId);
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
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findBlocks(@Request() req: ExpressRequest): Promise<UserFollowDto[]> {
    console.log('findBlocks', req.user);
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const isBlock = true;
    const result = await this.userFollowService.findByUsers(userId, isBlock);
    return result.map((el) => new UserFollowDto(el));
  }

  private async createOrUpdate(
    req: ExpressRequest,
    dto: TargetUserDto,
    isBlock: boolean,
  ) {
    console.log('createOrUpdate', req.user, dto);
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const targetUserId = dto.targetUser;
    const result = await this.userFollowService.createOrUpdate(
      idOf(userId.value),
      idOf(targetUserId),
      isBlock,
    );
    return result;
  }

  private async delete(
    req: ExpressRequest,
    dto: TargetUserDto,
    isBlock: boolean,
  ) {
    console.log('createOrUpdate', req.user, dto);
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const targetUserId = dto.targetUser;
    return await this.userFollowService.remove(
      idOf(userId.value),
      idOf(targetUserId),
      isBlock,
    );
  }
}
