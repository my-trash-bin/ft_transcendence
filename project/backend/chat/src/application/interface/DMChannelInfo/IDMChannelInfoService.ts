import { ChatUserId } from '../ChatUser/view/ChatUserView';
import { DMChannelInfoView } from './view/DMChannelInfoView';

export interface IDMChannelInfoService {
  findOrCreate(
    fromId: ChatUserId,
    toId: ChatUserId,
    name: string,
  ): Promise<DMChannelInfoView>;
  delete(fromId: ChatUserId, toId: ChatUserId): Promise<DMChannelInfoView>;
}
