import { ChannelMemberType } from '@prisma/client';
import { ChannelId } from '../../Channel/view/ChannelView';
import { ChatUserId } from '../../ChatUser/view/ChatUserView';

export interface ChannelMemberView {
  channelId: ChannelId;
  memberId: ChatUserId;
  memberType: ChannelMemberType;
  mutedUntil: Date;
}
