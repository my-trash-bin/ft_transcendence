import { ApiProperty } from '@nestjs/swagger';

export class PongSeasonLogDto {
  @ApiProperty({ example: 1, description: '시즌 번호' })
  season!: number;

  @ApiProperty({ example: 'uuid', description: '사용자 ID' })
  @ApiProperty({
    example: '23675fe6-3054-461c-810d-c2ea86055c33',
    description: '사용자 ID',
    type: 'string',
    format: 'uuid',
  })
  userId!: string;

  @ApiProperty({ example: 3, description: '연속 승리 횟수' })
  consecutiveWin!: number;

  @ApiProperty({ example: 5, description: '최대 연속 승리 횟수' })
  maxConsecutiveWin!: number;

  @ApiProperty({ example: 2, description: '최대 연속 패배 횟수' })
  maxConsecutiveLose!: number;

  @ApiProperty({ example: 10, description: '총 승리 횟수' })
  win!: number;

  @ApiProperty({ example: 8, description: '총 패배 횟수' })
  lose!: number;

  @ApiProperty({ example: 18, description: '총 게임 횟수' })
  total!: number;

  @ApiProperty({ example: 55.56, description: '승률(백분율)', type: 'float' })
  winRate!: number;
}
