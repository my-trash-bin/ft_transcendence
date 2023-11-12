import { ChannelId } from '../Channel/view/ChannelView';
import { ChatUserId } from '../ChatUser/view/ChatUserView';
import { ChannelInvitationView } from './view/ChannelInvitationView';

export interface IChannelInvitationService {

  addInvitation(
    channelId: ChannelId,
    memberId: ChatUserId, 
  ): Promise<ChannelInvitationView>;

  deleteInvitation(
    channelId: ChannelId,
    memberId: ChatUserId,
  ): Promise<ChannelInvitationView>;
}
