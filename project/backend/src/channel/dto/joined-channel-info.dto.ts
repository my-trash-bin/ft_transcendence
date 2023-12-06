import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ChannelMemberDetailDto } from './channel-member-detail.dto';
import { ChannelMemberDto } from './channel-members.dto';
import { ChannelMessageDto } from './channel-message.dto';
import { ChannelDto } from './channel.dto';

export class JoinedChannelInfoDto {
  @ApiProperty({ description: '채널멤버 정보', type: () => ChannelMemberDto })
  channelMember!: ChannelMemberDto;

  @ApiProperty({ description: '채널 정보', type: () => ChannelMemberDto })
  channel!: ChannelDto;

  @ApiProperty({
    description: '채널 참여자 리스트',
    type: () => ChannelMemberDto,
    isArray: true,
  })
  members!: ChannelMemberDetailDto[];

  @ApiProperty({
    description: '채널 메시지 리스트',
    type: () => ChannelMemberDto,
    isArray: true,
  })
  messages!: (ChannelMessageDto & { member: UserDto })[];
}
