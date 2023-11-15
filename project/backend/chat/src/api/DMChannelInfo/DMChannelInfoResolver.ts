import { Arg, Query, Resolver } from 'type-graphql';
import { DMChannelInfoService } from '../../application/implementation/DMChannelInfo/DMChannelInfoService';
import { idOf } from '../../util/id/idOf';
import { DMChannelInfo } from './DMChannelInfo';
import { DMChannelInfoViewModel } from './DMChannelInfoViewModel';
import { mapToDMChannelInfoViewModel } from './mapToDMChannelInfoViewModel';

@Resolver(() => DMChannelInfo)
export class DMChannelInfoResolver {
  constructor(private readonly dmChannelInfoService: DMChannelInfoService) {}

  @Query(() => [DMChannelInfoViewModel])
  async dmChannelInfo(
    @Arg('fromId') fromId: string,
    @Arg('toId') toId: string,
  ): Promise<DMChannelInfoViewModel> {
    const view = await this.dmChannelInfoService.findOrCreate(
      idOf(fromId),
      idOf(toId),
    );
    return mapToDMChannelInfoViewModel(view);
  }
}
