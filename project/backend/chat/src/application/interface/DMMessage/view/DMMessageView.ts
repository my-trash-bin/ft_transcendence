import { ChatUserId } from '../../ChatUser/view/ChatUserView';
import { DMChannelAssociationId } from '../../DMChannelAssociation/view/DMChannelAssociationView';
import { Id } from '../../Id';

export type DMMessageId = Id<'dMMessage'>;

export interface DMMessageView {
  id: DMMessageId;
  channelId: DMChannelAssociationId;
  memberId: ChatUserId;
  sentAt: Date;
  messageJson: string;
}
