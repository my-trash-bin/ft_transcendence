import { UserDto } from '../../users/dto/user.dto';
import { ChannelDto } from './channel.dto';

export class LeavingChannelResponseDto {
  channel!: ChannelDto;
  member!: UserDto;
}
