import { UserDto } from '../../users/dto/user.dto';
import { ChangeActionType } from '../channel.service';

export class ChangeMemberStatusResultDto {
  triggerUser!: UserDto;
  targetUser!: UserDto;
  channelId!: string;
  actionType!: ChangeActionType;
}
