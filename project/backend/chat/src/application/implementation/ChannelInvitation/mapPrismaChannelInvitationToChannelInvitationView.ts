// mapPrismaChannelInvitationToChannelInvitationView

import { idOf } from '../../../util/id/idOf';
import { ChannelInvitationView } from '../../interface/ChannelInvitaion/view/ChannelInvitationView';
import { PrismaChannelInvitation } from './PrismaChannelInvitation';

export function mapPrismaChannelInvitationToChannelInvitationView({
  channelId,
  memberId,
  invitedAt,
}: PrismaChannelInvitation): ChannelInvitationView {
  return {
    channelId: idOf(channelId),
    memberId: idOf(memberId),
    invitedAt
  };
}
