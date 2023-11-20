import { ApiProperty } from '@nestjs/swagger';

export class NicknameCheckUserDto {
  @ApiProperty()
  nickname!: string;
}
