import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { MessagePaginationDto } from '../channel/dto/message-pagination.dto';
import { DmService } from './dm.service';
import { DmChannelMessageDto } from './dto/dm-list.dto';
import { MessageWithMemberDto } from './dto/message-with-member';

@ApiTags('dm')
@Controller('/api/v1/dm')
export class DmController {
  private logger = new Logger('DmController');
  constructor(private readonly dmService: DmService) {}

  // @Get('dmChannels')
  // @ApiOkResponse({
  //   type: () => DmMessageDto,
  //   isArray: true,
  // })
  // async getDMChannelsWithMessages(
  //   @Req() req: ExpressRequest,
  // ): Promise<DmMessageDto[]> {
  //   const { id } = req.user as JwtPayloadPhaseComplete;
  //   return await this.dmService.getDMChannelsWithMessages(id);
  // }

  @Get(':nickname')
  @ApiOperation({ summary: '특정 유저와의 DM 채널 정보' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @ApiOkResponse({
    type: () => MessageWithMemberDto,
    isArray: true,
  })
  async getDMChannelMessages(
    @Param('nickname') nickname: string,
    @Query() dto: MessagePaginationDto,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const { cursorTimestamp, pageSize } = dto;
    const res = await this.dmService.getDMChannelMessagesByNickname(
      userId,
      nickname || '',
      cursorTimestamp,
      pageSize,
    );
    return res!.data;
  }

  @Get()
  @ApiOperation({ summary: '유저에게 보여줄 DM 채널 리스트' })
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @ApiOkResponse({
    type: () => DmChannelMessageDto,
    isArray: true,
  })
  async getMyDmList(@Request() req: ExpressRequest) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const res = await this.dmService.getMyDmList(userId.value);
    return res;
  }

  @Get('valid/:nickname')
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @ApiOkResponse({
    type: () => Boolean,
  })
  async canSendDm(
    @Param('nickname') nickname: string,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const res = await this.dmService.canSendDm(nickname, userId.value);
    return res;
  }
}
