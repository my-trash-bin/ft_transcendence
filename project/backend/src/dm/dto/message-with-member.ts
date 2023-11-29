import { UserDto } from '../../users/dto/user.dto';

export class MessageWithMemberDto {
  id!: string;
  channelId!: string;
  memberId!: string;
  sentAt!: Date;
  messageJson!: string;
  member!: UserDto;
}

export class UserInMessageInfoDto {
  id!: string;
  nickname!: string;
  profileImageUrl!: string | null;
  statusMessage!: string;
}
