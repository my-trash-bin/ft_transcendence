import { ChannelId } from "../../Channel/view/ChannelView";
import { ChatUserId } from "../../ChatUser/view/ChatUserView";

export interface ChannelInvitationView {
  channelId : ChannelId;
  memberId  : ChatUserId; 
  invitedAt : Date;
}