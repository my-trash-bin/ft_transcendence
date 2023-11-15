import { Arg, Query, Resolver } from 'type-graphql';
import { InvalidIdException } from '../../application/exception/InvalidIdException';
import { ChannelMessageService } from '../../application/implementation/ChannelMessage/ChannelMessageService';
import { filterInvalidIdException } from '../../util/filterInvalidIdException';
import { idOf } from '../../util/id/idOf';
import { ChannelMessage } from './ChannelMessage';
import { ChannelMessageViewModel } from './ChannelMessageViewModel';
import { mapToChannelMessageViewModel } from './mapToChannelMessageViewModel';

@Resolver(() => ChannelMessage)
export class ChannelMessageResolver {
  constructor(private readonly channelMessageService: ChannelMessageService) {}

  @Query(() => [ChannelMessageViewModel])
  async channelMessages(
    @Arg('ids') ids: string[],
  ): Promise<ChannelMessageViewModel[]> {
    const results = await this.channelMessageService.getMany(
      ids.map((id) => idOf(id)),
    );
    const channelMessageViews = filterInvalidIdException(results);
    return channelMessageViews.map(mapToChannelMessageViewModel);
  }

  @Query(() => ChannelMessageViewModel)
  async channelMessage(
    @Arg('id') id: string,
  ): Promise<ChannelMessageViewModel> {
    const result = await this.channelMessages([id]);
    if (!result) {
      throw new InvalidIdException(id);
    }
    return result[0];
  }

  async sendMessageToChannel(
    @Arg('channelId') channelId: string,
    @Arg('messageJson') messageJson: string,
  ): Promise<ChannelMessageViewModel> {
    const result = await this.channelMessageService.create(
      idOf(channelId),
      messageJson,
    );
    return mapToChannelMessageViewModel(result);
  }

  @Query(() => [ChannelMessageViewModel])
  async getMessagesByChannel(
    @Arg('id') id: string,
  ): Promise<ChannelMessageViewModel[]> {
    const results = await this.channelMessageService.findByChannel(idOf(id));
    const channelMessageViews = filterInvalidIdException(results);
    return channelMessageViews.map(mapToChannelMessageViewModel);
  }

  @Query(() => [ChannelMessageViewModel])
  async getMessagesByMember(
    @Arg('id') id: string,
  ): Promise<ChannelMessageViewModel[]> {
    const results = await this.channelMessageService.findByMember(idOf(id));
    const channelMessageViews = filterInvalidIdException(results);
    return channelMessageViews.map(mapToChannelMessageViewModel);
  }
}
