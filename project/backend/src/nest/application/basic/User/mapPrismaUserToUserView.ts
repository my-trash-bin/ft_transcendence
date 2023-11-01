import { idOf } from '../../util/id/idOf';
import { PrismaUser } from './PrismaUser';
import { UserView } from './UserView';

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
