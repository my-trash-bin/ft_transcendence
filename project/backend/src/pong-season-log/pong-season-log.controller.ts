import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { idOf } from '../common/Id';
import { PongSeasonLogService } from './pong-season-log.service';

@ApiTags('pong-season-log')
@Controller('pong-season-log')
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
  findOne(@Param('id') id: string) {
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
