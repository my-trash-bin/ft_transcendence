import { InvalidIdException } from "../../exception/InvalidIdException";
import { ChannelMessageId, ChannelMessageView } from "./view/ChannelMessageView";

export interface IChannelMessageService {

  getMany(
    ids: ChannelMessageId[]
  ): Promise<(ChannelMessageView | InvalidIdException)[]>

  sendMessageToChannel(
    channelId: string,
    messageJson: string
  ): Promise<ChannelMessageView | InvalidIdException>;
  
  getMessagesByChannel(
    channelId: string
  ): Promise<(ChannelMessageView | InvalidIdException)[]>;
  
  getMessagesByMember(
    memberId: string
  ): Promise<(ChannelMessageView | InvalidIdException)[]>;
}
