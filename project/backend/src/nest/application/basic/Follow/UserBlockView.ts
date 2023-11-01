import { UserView } from '../User/UserView';

export interface UserBlockView {
  blockee: UserView;
  BlockedAt: Date;
}
