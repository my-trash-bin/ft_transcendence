import { ChatUserId } from "../ChatUser/view/ChatUserView";
import { DMChannelInfoId, DMChannelInfoView } from "./view/DMChannelInfoView";

export interface IDMChannelInfoService {
  findOrCreate(
    fromId: ChatUserId,
    toId: ChatUserId,
    channelId: DMChannelInfoId,
    name: string,
  ): Promise<DMChannelInfoView>;
  delete(
    fromId: ChatUserId,
    toId: ChatUserId
  ): Promise<DMChannelInfoView>;
}