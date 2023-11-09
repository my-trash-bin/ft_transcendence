import { InvalidIdException } from '../../exception/InvalidIdException';
import { ChatUserId, ChatUserView } from './view/ChatUserView';

export interface IChatUserService {
  getMany(
    ids: readonly ChatUserId[],
  ): Promise<(ChatUserView | InvalidIdException)[]>;
  create(): Promise<ChatUserView>;
}
