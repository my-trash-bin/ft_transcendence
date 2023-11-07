import { UserRelationView } from '../../interface/UserFollow/view/UserRelationView';
import { mapPrismaUserToUserView } from '../User/mapPrismaUserToUserView';
import { PrismaUserFollowWithFollower } from './PrismaUserFollowWithMainUser';

export function mapPrismaUserFollowWithFollowerToUserRelationView({
  followOrBlockedAt,
  follower,
}: PrismaUserFollowWithFollower): UserRelationView {
  return {
    ...mapPrismaUserToUserView(follower),
    followOrBlockedAt,
  };
}
