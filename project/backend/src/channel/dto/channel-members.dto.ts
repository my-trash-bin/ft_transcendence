import { ApiProperty } from '@nestjs/swagger';
import { ChannelMemberType } from '@prisma/client';
import { UserDto } from '../../users/dto/user.dto';

export class ChannelMemberDto {
  @ApiProperty()
  channelId!: string;

  @ApiProperty()
  memberId!: string;

  @ApiProperty({ enum: ChannelMemberType })
  memberType!: ChannelMemberType;

  @ApiProperty({ type: Date })
  mutedUntil!: Date;

  @ApiProperty({ type: UserDto })
  member!: UserDto;
}
