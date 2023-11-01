import { UserView } from '../../User/view/UserView';

export interface UserFollowView {
  followee: UserView;
  followedAt: Date;
}
