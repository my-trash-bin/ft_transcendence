import { idOf } from '../../../util/id/idOf';
import { UserView } from '../../interface/User/view/UserView';
import { PrismaUser } from './PrismaUser';

export function mapPrismaUserToUserView({
  id,
  nickname,
  profileImageUrl,
  joinedAt,
  leavedAt,
}: PrismaUser): UserView {
  return {
    id: idOf(id),
    nickname,
    profileImageUrl: profileImageUrl ?? undefined,
    joinedAt,
    leavedAt: leavedAt ?? undefined,
  };
}
