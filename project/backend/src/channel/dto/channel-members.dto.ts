import { ApiProperty } from '@nestjs/swagger';
import { ChannelMemberType } from '@prisma/client';

export class ChannelMemberDto {
  @ApiProperty()
  channelId!: string;

  @ApiProperty()
  memberId!: string;

  @ApiProperty({ enum: ChannelMemberType })
  memberType!: ChannelMemberType;

  @ApiProperty({ type: Date })
  mutedUntil!: Date;
}

export const channelMemberDtoSelect = {
  channelId: true,
  memberId: true,
  memberType: true,
  mutedUntil: true,
};
