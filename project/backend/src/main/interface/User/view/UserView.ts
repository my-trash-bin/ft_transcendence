import { Id } from '../../Id';

export type UserId = Id<'user'>;

export interface UserView {
  id: UserId;
  nickname: string;
  profileImageUrl: string | undefined;
  joinedAt: Date;
  leavedAt: Date | undefined;
}
