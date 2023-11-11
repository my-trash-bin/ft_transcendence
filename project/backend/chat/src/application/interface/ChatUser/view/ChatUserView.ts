import { Id } from '../../Id';

export type ChatUserId = Id<'chatUser'>;
export type AuthUserId = Id<'authUser'>;

export interface ChatUserView {
  id: ChatUserId;
  authUserId: AuthUserId;
}
