import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { idOf } from '../common/Id';
import { ChannelRoomType, EventsService } from '../events/events.service';
import { ChannelService } from './channel.service';
import { ChannelIdDto } from './dto/channel-id.dto';
import { ChannelMemberDto } from './dto/channel-members.dto';
import { ChannelRelationDto } from './dto/channel-relation.dto';
import { ChannelWithAllInfoDto } from './dto/channel-with-all-info.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('channel')
@Controller('/api/v1/channel')
export class ChannelController {
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
    @Param('channelId') chaennelId: string,
  ): Promise<ChannelMemberDto[]> {
    const result = await this.channelService.findChannelMembersByChannelId(
      idOf(chaennelId),
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

  // @Get('participand/:cheenlId')
  // @ApiOperation({ summary: '채널 참여자 목록' })
  // @ApiOkResponse({
  //   description: '생성된 채널 정보 객체 반환',
  //   type: () => {},
  // })
  // findChannelMembers() {}
}
