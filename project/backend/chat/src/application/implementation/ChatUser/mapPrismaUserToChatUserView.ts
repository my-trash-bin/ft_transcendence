import { idOf } from '../../../util/id/idOf';
import { ChatUserView } from '../../interface/ChatUser/view/ChatUserView';
import { PrismaChatUser } from './PrismaChatUser';

// 2. 프리즈마
export function mapPrismaUserToChatUserView({
  id,
  authUserId,
}: PrismaChatUser): ChatUserView {
  return {
    id: idOf(id),
    authUserId: idOf(authUserId),
  };
}
