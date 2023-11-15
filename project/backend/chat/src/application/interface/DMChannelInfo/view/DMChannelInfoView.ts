import { ChatUserId } from '../../ChatUser/view/ChatUserView';
import { DMChannelAssociationId } from '../../DMChannelAssociation/view/DMChannelAssociationView';
import { Id } from '../../Id';

export type DMChannelInfoId = Id<'dMCHnnelInfoId'>;

export interface DMChannelInfoView {
  fromId: ChatUserId;
  toId: ChatUserId;
  channelId: DMChannelAssociationId;
  name: string;
}
