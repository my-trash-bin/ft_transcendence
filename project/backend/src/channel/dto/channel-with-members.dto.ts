import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { ChannelMemberDetailDto } from './channel-member-detail.dto';
import { ChannelDto } from './channel.dto';

export class ChannelWithMembersDto extends ChannelDto {
  @ApiProperty()
  members!: ChannelMemberDetailDto[];

  constructor(
    input: Channel & {
      members: ChannelMemberDetailDto[];
    },
  ) {
    super(input);
    this.members = input.members;
  }
}
