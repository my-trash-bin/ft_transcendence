import { Id } from '../../Id';

export type UserId = Id<'user'>;
export type AuthUserId = Id<'authUser'>;

export interface UserView {
  id: UserId;
  authUserId: AuthUserId;
  nickname: string;
  profileImageUrl: string | undefined;
}
