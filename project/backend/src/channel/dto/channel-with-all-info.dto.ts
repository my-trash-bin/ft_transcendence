import { ApiProperty } from '@nestjs/swagger';
import { Channel } from '@prisma/client';
import { ChannelMemberDetailDto } from './channel-member-detail.dto';
import { ChannelMessageDto } from './channel-message.dto';
import { ChannelWithMembersDto } from './channel-with-members.dto';

export class ChannelWithAllInfoDto extends ChannelWithMembersDto {
  @ApiProperty()
  messages!: ChannelMessageDto[];

  constructor(
    input: Channel & {
      members: ChannelMemberDetailDto[];
      messages: ChannelMessageDto[];
    },
  ) {
    super(input);
    this.messages = input.messages;
  }
}
