import { InvalidIdException } from "../../exception/InvalidIdException";
import { ChannelId } from "../Channel/view/ChannelView";
import { ChatUserId } from "../ChatUser/view/ChatUserView";
import { ChannelMessageId, ChannelMessageView } from "./view/ChannelMessageView";

export interface IChannelMessageService {

  getMany(
    ids: ChannelMessageId[]
  ): Promise<(ChannelMessageView | InvalidIdException)[]>

  create(
    channelId: ChannelId,
    messageJson: string
  ): Promise<ChannelMessageView>;
  
  findByChannel(
    channelId: ChannelId
  ): Promise<ChannelMessageView[]>;
  
  findByMember(
    memberId: ChatUserId
  ): Promise<ChannelMessageView[]>;
}
