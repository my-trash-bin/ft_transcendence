import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel-dto';
import { ChannelRelationDto } from './dto/channel-relation-dto';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('channel')
@Controller('/api/v1/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('all')
  @ApiOperation({ summary: '모든 채널 검색' })
  @ApiOkResponse({
    description: '모든 채널 리스트 반환',
    type: () => ChannelDto,
    isArray: true,
  })
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
  async create(@Body() dto: CreateChannelDto, @Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    console.log('create에서 req.user 테스트');
    console.log(`userId: ${userId}`);
    console.log('req.user 객체');
    console.log(req.user);
    console.log('--------------------------------');
    return await this.channelService.create(userId, dto);
  }

  // @Get('participand/:cheenlId')
  // @ApiOperation({ summary: '채널 참여자 목록' })
  // @ApiOkResponse({
  //   description: '생성된 채널 정보 객체 반환',
  //   type: () => {},
  // })
  // findChannelMembers() {}
}
