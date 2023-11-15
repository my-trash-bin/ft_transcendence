import { InvalidIdException } from '../../exception/InvalidIdException';
import { ChatUserId, ChatUserView } from './view/ChatUserView';

export interface IChatUserService {
  getMany(
    ids: readonly ChatUserId[],
  ): Promise<(ChatUserView | InvalidIdException)[]>;
  findOne(chatUserId: ChatUserId): Promise<ChatUserView>;
  create(): Promise<ChatUserView>;
  findOrCreate(): Promise<ChatUserView>;
}
