import { idOf } from '../../../util/id/idOf';
import { UserView } from '../../interface/User/view/UserView';
import { PrismaUser } from './PrismaUser';

// 2. 프리즈마
export function mapPrismaUserToUserView({
  id,
  authUserId,
  nickname,
  profileImageUrl,
}: PrismaUser): UserView {
  return {
    id: idOf(id),
    authUserId: idOf(authUserId),
    nickname,
    profileImageUrl: profileImageUrl ?? undefined,
  };
}
