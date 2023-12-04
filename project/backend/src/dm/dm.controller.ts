import {
  Controller,
  Get,
  Logger,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Phase, PhaseGuard } from '../auth/phase.guard';
import { DmService } from './dm.service';
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
  @UseGuards(JwtGuard, PhaseGuard)
  @Phase('complete')
  @ApiOkResponse({
    type: () => MessageWithMemberDto,
    isArray: true,
  })
  async getDMChannelMessages(
    @Param('nickname') nickname: string,
    @Request() req: ExpressRequest,
  ) {
    const userId = (req.user as JwtPayloadPhaseComplete).id;
    const res = await this.dmService.getDMChannelMessagesByNickname(
      userId,
      nickname || '',
    );
    return res!.data;
  }
}
