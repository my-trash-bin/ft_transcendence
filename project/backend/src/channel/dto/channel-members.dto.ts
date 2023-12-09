import { ApiProperty } from '@nestjs/swagger';
import { ChannelMember, ChannelMemberType } from '@prisma/client';

export class ChannelMemberDto {
  @ApiProperty()
  channelId!: string;

  @ApiProperty()
  memberId!: string;

  @ApiProperty({ enum: ChannelMemberType })
  memberType!: ChannelMemberType;

  @ApiProperty({ type: Date })
  mutedUntil!: Date;

  constructor(input: ChannelMember) {
    this.channelId = input.channelId;
    this.memberId = input.memberId;
    this.memberType = input.memberType;
    this.mutedUntil = input.mutedUntil;
  }
}

export const channelMemberDtoSelect = {
  channelId: true,
  memberId: true,
  memberType: true,
  mutedUntil: true,
};
