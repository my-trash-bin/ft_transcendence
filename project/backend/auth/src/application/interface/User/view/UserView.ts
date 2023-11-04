import { Id } from '../../Id';

export type UserId = Id<'user'>;

export interface UserView {
  id: UserId;
  joinedAt: Date;
  leavedAt?: Date;
}
