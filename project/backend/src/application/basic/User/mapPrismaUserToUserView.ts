import { User } from '@prisma/client';
import { idOf } from '../../util/id/idOf';
import { UserView } from './UserView';

export function mapPrismaUserToUserView({
  id,
  nickname,
  profileImageUrl,
  joinedAt,
  isLeaved,
  leavedAt,
}: User): UserView {
  return {
    id: idOf(id),
    nickname,
    profileImageUrl: profileImageUrl ?? undefined,
    joinedAt,
    isLeabed: isLeaved ?? undefined,
    leavedAt: leavedAt ?? undefined,
  };
}
