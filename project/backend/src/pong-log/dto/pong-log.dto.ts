import { ApiProperty } from '@nestjs/swagger';
import { PongGameHistory } from '@prisma/client';

export class PongLogDto {
  @ApiProperty({ description: '레코드 UUID' })
  id!: string;

  @ApiProperty({ description: '유저1 ID' })
  player1Id!: string;

  @ApiProperty({ description: '유저2 ID' })
  player2Id!: string;

  @ApiProperty({ description: '유저1 스코어' })
  player1Score!: number;

  @ApiProperty({ description: '유저2 스코어' })
  player2Score!: number;

  @ApiProperty({ description: '유저1의 승리 여부' })
  isPlayer1win!: boolean;

  @ApiProperty({ description: '레코드 생성 일자', type: Date })
  createdAt!: Date;

  constructor(input: PongGameHistory) {
    this.id = input.id;
    this.player1Id = input.player1Id;
    this.player2Id = input.player2Id;
    this.player1Score = input.player1Score;
    this.player2Score = input.player2Score;
    this.isPlayer1win = input.isPlayer1win;
    this.createdAt = input.createdAt;
  }
}
