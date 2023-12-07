import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ChannelMemberDto } from './channel-members.dto';
import { ChannelDto } from './channel.dto';

export class JoinedChannelInfoDto {
  @ApiProperty({ description: '들어온 유저 채널', type: () => ChannelDto })
  channel!: ChannelDto;

  @ApiProperty({ description: '들어온 유저', type: () => UserDto })
  member!: UserDto;

  @ApiProperty({
    description: '들어온 유저의 채널멤버로서 정보',
    type: () => ChannelMemberDto,
  })
  channelMember!: ChannelMemberDto;
}
