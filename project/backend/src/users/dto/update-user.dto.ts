import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  nickname?: string;

  @ApiProperty({ required: false })
  profileImageUrl?: string;
}
