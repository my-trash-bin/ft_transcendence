import { UserRelationView } from '../../interface/UserFollow/view/UserRelationView';
import { mapPrismaUserToUserView } from '../User/mapPrismaUserToUserView';
import { PrismaUserFollowWithFollowee } from './PrismaUserFollowWithMainUser';

export function mapPrismaUserFollowWithFolloweeToUserRelationView({
  followOrBlockedAt,
  followee,
}: PrismaUserFollowWithFollowee): UserRelationView {
  return {
    ...mapPrismaUserToUserView(followee),
    followOrBlockedAt,
  };
}
