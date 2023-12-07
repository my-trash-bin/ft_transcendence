import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ChannelDto } from './channel.dto';

export class LeavingChannelResponseDto {
  @ApiProperty({ description: '유저나 나간 채널', type: () => ChannelDto })
  channel!: ChannelDto;

  @ApiProperty({ description: '나간 유저', type: () => UserDto })
  member!: UserDto;
}
