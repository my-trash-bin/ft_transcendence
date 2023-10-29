import { UserView } from '../User/UserView';

export interface UserFollowView {
  followee: UserView;
  followedAt: Date;
}
