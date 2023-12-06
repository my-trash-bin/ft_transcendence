import { ApiProperty } from '@nestjs/swagger';
import { PongGameHistory, User } from '@prisma/client';
import { UserDto } from '../../users/dto/user.dto';
import { PongLogDto } from './pong-log.dto';

export class PongLogDtoWithPlayerDto extends PongLogDto {
  @ApiProperty({ description: '유저1 유저 객체', type: () => UserDto })
  player1!: UserDto;

  @ApiProperty({ description: '유저2 유저 객체', type: () => UserDto })
  player2!: UserDto;

  constructor(input: PongGameHistoryWithPlayerType) {
    super(input);
    this.player1 = new UserDto(input.player1);
    this.player2 = new UserDto(input.player2);
  }
}

export type PongGameHistoryWithPlayerType = PongGameHistory & {
  player1: User;
  player2: User;
};
