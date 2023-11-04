import { idOf } from '../../../util/id/idOf';
import { UserView } from '../../interface/User/view/UserView';
import { PrismaUser } from './PrismaUser';

export function mapPrismaUserToUserView({
  id,
  joinedAt,
  leavedAt,
}: PrismaUser): UserView {
  return {
    id: idOf(id),
    joinedAt,
    leavedAt: leavedAt ?? undefined,
  };
}
