import { idOf } from '../../../util/id/idOf';
import { ChannelView } from '../../interface/Channel/view/ChannelView';
import { PrismaChannel } from './PrismaChannel';


export function mapPrismaChannelToChannelView({
  id,
  title,
  isPublic,
  password,
  createdAt,
  lastActiveAt,
  ownerId,
  memberCount,
  maximumMemberCount,
}: PrismaChannel): ChannelView {
  return {
    id: idOf(id),
    title,
    isPublic,
    password: password ?? undefined,
    createdAt,
    lastActiveAt,
    ownerId: ownerId ? idOf(ownerId) : undefined,
    memberCount,
    maximumMemberCount,
  };
}
