import { InvalidIdException } from "../../exception/InvalidIdException";
import { ChannelMessageId, ChannelMessageView } from "./view/ChannelMessageView";

export interface IChannelMessageService {

  getMany(
    ids: ChannelMessageId[]
  ): Promise<(ChannelMessageView | InvalidIdException)[]>

  sendMessageToChannel(
    channelId: string,
    messageJson: string
  ): Promise<ChannelMessageView>;
  
  getMessagesByChannel(
    channelId: string
  ): Promise<ChannelMessageView[]>;
  
  getMessagesByMember(
    memberId: string
  ): Promise<ChannelMessageView[]>;
}
