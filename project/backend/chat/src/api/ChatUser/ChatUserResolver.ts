import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { ChatUserService } from '../../application/implementation/ChatUser/ChatUserService';
import { ChatUserId } from '../../application/interface/ChatUser/view/ChatUserView';
import { filterInvalidIdException } from '../../util/filterInvalidIdException';
import { idOf } from '../../util/id/idOf';
import { ChatUser } from './ChatUser';
import { ChatUserViewModel } from './ChatUserViewModel';
import { mapToChatUserViewModel } from './mapToChatUserViewModel';

@Resolver(() => ChatUser)
export class ChatUserResolver {
  constructor(private chatUserService: ChatUserService) {}

  @Query(() => [ChatUserViewModel])
  async getChatUsers(
    @Arg('ids') ids: readonly string[],
  ): Promise<ChatUserViewModel[]> {
    const chatUserIds: ChatUserId[] = ids.map((id) => idOf(id));
    const results = await this.chatUserService.getMany(chatUserIds);
    const chatUserViews = filterInvalidIdException(results);
    return chatUserViews.map(mapToChatUserViewModel);
  }

  @Query(() => ChatUserViewModel)
  async chatUser(@Arg('id') id: string): Promise<ChatUserViewModel> {
    const chatUserView = await this.chatUserService.findOne(idOf(id));
    return mapToChatUserViewModel(chatUserView);
  }

  @Mutation(() => ChatUserViewModel)
  async me(): Promise<ChatUserViewModel> {
    // TODO: context에 담겨야할 user에 따른 핸들링
    const chatUserView = await this.chatUserService.findOrCreate();
    return mapToChatUserViewModel(chatUserView);
  }
}
