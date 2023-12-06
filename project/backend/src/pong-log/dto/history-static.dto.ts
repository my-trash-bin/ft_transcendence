import { ApiProperty } from '@nestjs/swagger';

export class HistoryStaticDto {
  @ApiProperty({ description: '총 승리수' })
  wins!: number;

  @ApiProperty({ description: '총 패배수' })
  losses!: number;

  @ApiProperty({ description: '총 경기수' })
  totalGames!: number;

  @ApiProperty({ description: '승률' })
  winRate!: number;

  @ApiProperty({ description: '최대 연승 수' })
  maxConsecutiveWins!: number;

  @ApiProperty({ description: '현재 연승/연패 정보' })
  recentStreak!: number;
}
