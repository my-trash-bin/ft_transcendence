import { Arg, Query, Resolver } from 'type-graphql';
import { DMMessageService } from '../../application/implementation/DMMesage/DMMessageService';
import { filterInvalidIdException } from '../../util/filterInvalidIdException';
import { idOf } from '../../util/id/idOf';
import { DMMessage } from './DMMessage';
import { DMMessageViewModel } from './DMMessageViewModel';
import { mapToDMMessageViewModel } from './mapToDMMessageViewModel';

@Resolver(() => DMMessage)
export class DMMessageResolver {
  constructor(private readonly dMMessageService: DMMessageService) {}

  @Query(() => [DMMessageViewModel])
  async channelMessages(
    @Arg('ids') ids: string[],
  ): Promise<DMMessageViewModel[]> {
    const results = await this.dMMessageService.getMany(
      ids.map((id) => idOf(id)),
    );
    const dMMessageViews = filterInvalidIdException(results);
    return dMMessageViews.map(mapToDMMessageViewModel);
  }

  async dmMessage(@Arg('id') id: string): Promise<DMMessageViewModel> {
    const dmMessageView = await this.dMMessageService.findOne(idOf(id));
    return mapToDMMessageViewModel(dmMessageView);
  }

  async sendDM(
    @Arg('channelId') dmChannelId: string,
    @Arg('messageJson') messageJson: string,
  ): Promise<DMMessageViewModel> {
    const result = await this.dMMessageService.create(
      idOf(dmChannelId),
      messageJson,
    );
    return mapToDMMessageViewModel(result);
  }

  @Query(() => [DMMessageViewModel])
  async getDMByChannel(@Arg('id') id: string): Promise<DMMessageViewModel[]> {
    const results = await this.dMMessageService.findByChannel(idOf(id));
    const dMMessageViews = filterInvalidIdException(results);
    return dMMessageViews.map(mapToDMMessageViewModel);
  }
}
