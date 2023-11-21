import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { idOf } from '../common/Id';
import { PongSeasonLogDto } from './dto/pong-season-log.dto';
import { PongSeasonLogService } from './pong-season-log.service';

@ApiTags('pong-season-log')
@Controller('/api/v1/pong-season-log')
export class PongSeasonLogController {
  constructor(private readonly pongSeasonLogService: PongSeasonLogService) {}

  // @Post()
  // create(@Body() createPongSeasonLogDto: CreatePongSeasonLogDto) {
  //   return this.pongSeasonLogService.create(createPongSeasonLogDto);
  // }

  // @Get()
  // findAll() {
  //   return this.pongSeasonLogService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: '유저 1명의 시즌 로그 조회' })
  @ApiOkResponse({
    description: '유저 1명의 특정 시즌 로그 하나 반환',
    type: () => PongSeasonLogDto,
  })
  @ApiBadRequestResponse({ description: '올바르지 않은 id' })
  findOne(@Param('id') id: string): Promise<PongSeasonLogDto> {
    return this.pongSeasonLogService.findOne(idOf(id));
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePongSeasonLogDto: UpdatePongSeasonLogDto,
  // ) {
  //   return this.pongSeasonLogService.update(+id, updatePongSeasonLogDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pongSeasonLogService.remove(+id);
  // }
}
