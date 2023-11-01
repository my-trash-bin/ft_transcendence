import { UserView } from '../../User/view/UserView';

export interface UserBlockView {
  blockee: UserView;
  BlockedAt: Date;
}
