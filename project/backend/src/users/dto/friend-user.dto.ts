import { ApiProperty } from '@nestjs/swagger';

export class FrinedUserTdo {
  @ApiProperty()
  nickname!: string;
}
