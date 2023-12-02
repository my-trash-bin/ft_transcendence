import { Controller, Get, Logger, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtPayloadPhaseComplete } from '../auth/auth.service';
import { DmService } from './dm.service';

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

  @Get('dmChannels/nickname/:nickname')
  async getDMChannelMessages(
    @Param('nickname') nickname: string,
    @Req() req: ExpressRequest,
  ) {
    const { id } = req.user as JwtPayloadPhaseComplete;
    this.dmService.getDMChannelMessagesByNickname(id, nickname || '');
  }
}
