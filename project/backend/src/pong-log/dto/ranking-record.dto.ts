import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RankingRecordDto {
  @ApiProperty({ description: '유저아이디' })
  @IsUUID()
  playerId!: string;

  @ApiProperty({ description: '총 승리수' })
  wins!: number;

  @ApiProperty({ description: '총 패배수' })
  losses!: number;

  @ApiProperty({ description: '총 게임수' })
  totalGames!: number;

  @ApiProperty({ description: '승률' })
  winRate!: number;
}
