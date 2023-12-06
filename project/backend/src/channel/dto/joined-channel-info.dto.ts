import { UserDto } from '../../users/dto/user.dto';
import { ChannelMemberDetailDto } from './channel-member-detail.dto';
import { ChannelMemberDto } from './channel-members.dto';
import { ChannelMessageDto } from './channel-message.dto';
import { ChannelDto } from './channel.dto';

export class JoinedChannelInfoDto {
  channelMember!: ChannelMemberDto;
  channel!: ChannelDto;
  members!: ChannelMemberDetailDto[];
  messages!: (ChannelMessageDto & { member: UserDto })[];
}
