import { ApiProperty } from '@nestjs/swagger';

export class PongLogStatDto {
  @ApiProperty({ description: '총 승리수' })
  wins!: number;

  @ApiProperty({ description: '총 패배수' })
  losses!: number;

  @ApiProperty({ description: '총 게임수' })
  totalGames!: number;

  @ApiProperty({ description: '승률' })
  winRate!: number;
}
