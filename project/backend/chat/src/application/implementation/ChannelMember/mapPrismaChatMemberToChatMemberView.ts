import { idOf } from '../../../util/id/idOf';
import { ChannelMemberView } from '../../interface/ChannelMember/view/ChannelMemberView';
import { PrismaChannelMember } from './PrismaChannelMember';

export function mapPrismaChannelMemberToChannelMemberView({
  channelId,
  memberId,
  memberType,
  mutedUntil,
}: PrismaChannelMember): ChannelMemberView {
  return {
    channelId: idOf(channelId),
    memberId: idOf(memberId),
    memberType,
    mutedUntil,
  };
}
