import { ChannelId } from "../../Channel/view/ChannelView";
import { ChatUserId } from "../../ChatUser/view/ChatUserView";
import { Id } from "../../Id";

export type ChannelMessageId = Id<'channelMessageId'>;

export interface ChannelMessageView {
    id: ChannelMessageId;
    channelId: ChannelId;
    memberId: ChatUserId;
    sentAt: Date;
    messageJson: string;
}