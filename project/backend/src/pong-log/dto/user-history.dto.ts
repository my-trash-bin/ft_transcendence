import { ApiProperty } from '@nestjs/swagger';
import { HistoryStaticDto } from './history-static.dto';
import { PongLogDto } from './pong-log.dto';

export class UserHistoryDto extends HistoryStaticDto {
  @ApiProperty({
    description: '총 승리수',
    type: () => PongLogDto,
    isArray: true,
  })
  userLogs!: PongLogDto[];
}
