import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ChannelMemberDto } from './channel-members.dto';

export class ChannelMemberDetailDto extends ChannelMemberDto {
  @ApiProperty()
  member!: UserDto;
}

// export const channelMemberDetailDtoSelect = {
//   ...channelMemberDtoSelect,
//   member: {
//     select: {
//       userDtoSelect,
//     },
//   },
// };
