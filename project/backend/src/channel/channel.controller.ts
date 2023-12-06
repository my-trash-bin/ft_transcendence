import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { MessageWithMemberDto } from '../dm/dto/message-with-member';
import { ChannelRoomType, EventsService } from '../events/events.service';
import { ChannelService } from './channel.service';
import { ChannelIdDto } from './dto/channel-id.dto';
import { ChannelMemberDetailDto } from './dto/channel-member-detail.dto';
import { ChannelMemberDto } from './dto/channel-members.dto';
import { ChannelRelationDto } from './dto/channel-relation.dto';
import { ChannelWithAllInfoDto } from './dto/channel-with-all-info.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinedChannelInfoDto } from './dto/joined-channel-info.dto';
import { kickBanPromoteMuteRequsetDto } from './dto/kick-ban-promote-mute-requset.dto';
import { ParticipateChannelDto } from './dto/participate-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelType } from './enums/channel-type.enum';

@ApiTags('channel')
@Controller('/api/v1/channel')
export class ChannelController {
  private logger = new Logger('ChannelController');
  constructor(
    private readonly channelService: ChannelService,
    private readonly eventsService: EventsService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: '모든 채널 검색' })
  @ApiOkResponse({
    description: '모든 채널 리스트 반환',
    type: () => ChannelDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findAll() {
    return await this.channelService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: '내가 속한 채널 검색' })
  @ApiOkResponse({
    description: '내가 속한 채널 리스트 반환',
    type: () => ChannelRelationDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findMyChannels(@Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    return await this.channelService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: '채널 생성' })
  @ApiOkResponse({
    description: '생성된 채널 정보 객체 반환',
    type: () => ChannelDto,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async create(@Body() dto: CreateChannelDto, @Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;

    const result = await this.channelService.create(userId, dto);
    if (!result.ok) {
      if (result.error!.statusCode === 500) {
        throw new InternalServerErrorException(result.error!.message);
      }
      throw new BadRequestException(result.error!.message);
    }
    const channelId = result.data!.id;
    this.eventsService.handleUserJoinChannel(
      ChannelRoomType.NORMAL,
      idOf(channelId),
      userId,
    );
    return result.data!;
  }

  @Put()
  @ApiOperation({ summary: '채널 정보 변경' })
  @ApiOkResponse({
    description: '업데이트 된 채널 정보 객체 반환',
    type: () => ChannelDto,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async channelUpdate(
    @Request() req: ExpressRequest,
    @Body() dto: UpdateChannelDto,
  ) {
    const { id } = req.user as JwtPayloadPhaseComplete;
    const { channelId, type, title, password, capacity } = dto;
    const result = await this.channelService.channelUpdate(
      id,
      idOf(channelId),
      title,
      type !== ChannelType.Private,
      capacity,
      password,
    );

    if (!result.ok) {
      throw new HttpException(result.error!.message, result.error!.statusCode);
    }

    return result.data!;
  }

  @Get('participant/:channelId')
  @ApiOperation({ summary: '채널 참여자 목록 반환' })
  @ApiOkResponse({
    description: '채널 참여자 목록',
    type: () => ChannelMemberDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findChannelMembersByChannelId(
    @Param('channelId') channelId: string,
  ): Promise<ChannelMemberDto[]> {
    const result = await this.channelService.findChannelMembersByChannelId(
      idOf(channelId),
    );
    if (!result.ok) {
      throw new HttpException(result.error!.message, result.error!.statusCode);
    }
    return result.data!;
  }

  @Get(':channelId')
  @ApiOperation({ summary: '채널 정보 반환' })
  @ApiOkResponse({
    description: '채널 정보 및 참여자 목록',
    type: () => ChannelWithAllInfoDto,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async findChannelInfo(@Param() param: ChannelIdDto) {
    const result = await this.channelService.findChannelWithAllInfo(
      idOf(param.channelId),
    );
    if (!result.ok) {
      throw new HttpException(result.error!.message, result.error!.statusCode);
    }
    return result.data!;
  }

  @Get('messages/:channelId')
  @ApiOperation({ summary: '특정 채널 채팅 목록 반환' })
  @ApiOkResponse({
    type: () => MessageWithMemberDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async getChannelMessages(
    @Param('channelId') channelId: string,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const result = await this.channelService.getChannelMessages(
      channelId,
      userId,
    );
    if (!result.ok) {
      throw new HttpException(result.error!.message, result.error!.statusCode);
    }
    return result.data!;
  }

  @Post('/participate')
  @ApiOperation({ summary: '채널 참여하기 with 비번' })
  @ApiCreatedResponse({
    type: () => JoinedChannelInfoDto,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async participateChannel(
    @Body() dto: ParticipateChannelDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;

    return await this.channelService.participate(userId.value, dto);
  }

  @Post('/kickBanPromoteMute')
  @ApiOperation({ summary: '채널 참여자 상태 변경' })
  @ApiCreatedResponse({
    type: () => ChannelMemberDetailDto,
  })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  async kickBanPromoteMute(
    @Body() dto: kickBanPromoteMuteRequsetDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const { channelId, targetUserId, actionType } = dto;
    this.logger.debug(userId.value, channelId, targetUserId, actionType);
    const result = await this.channelService.changeMemberStatus(
      userId,
      idOf(channelId),
      idOf(targetUserId),
      actionType,
    );
    if (!result.ok) {
      if (result.error!.statusCode === 500) {
        throw new InternalServerErrorException(result.error!.message);
      }
      throw new BadRequestException(result.error!.message);
    }

    return result.data!;
  }

  // @Get('participand/:cheenlId')
  // @ApiOperation({ summary: '채널 참여자 목록' })
  // @ApiOkResponse({
  //   description: '생성된 채널 정보 객체 반환',
  //   type: () => {},
  // })
  // findChannelMembers() {}
}
