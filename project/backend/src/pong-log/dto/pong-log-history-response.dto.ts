import { ApiProperty } from '@nestjs/swagger';
import { PongLogStatDto } from './pong-log-stat.dto';
import { PongLogDtoWithPlayerDto } from './pong-log-with-player.dto';

export class PongLogHistoryResponse {
  @ApiProperty({ description: '스텟', type: () => PongLogStatDto })
  stats!: PongLogStatDto;

  @ApiProperty({
    description: '레코드',
    type: () => PongLogDtoWithPlayerDto,
    isArray: true,
  })
  records!: PongLogDtoWithPlayerDto[];
}
