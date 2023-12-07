import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { PongLogStatDto } from './pong-log-stat.dto';

export class PongLogRankingRecordDto extends PongLogStatDto {
  @ApiProperty({ description: '유저 객체', type: () => UserDto })
  user!: UserDto;

  @ApiProperty({ description: '유저 랭크' })
  rank!: number;
}
