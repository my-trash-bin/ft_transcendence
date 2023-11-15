import { Arg, Query, Resolver } from 'type-graphql';
import { DMChannelAssociationService } from '../../application/implementation/DMChannelAssociation/DMChannelAssociationService';
import { DMChannelAssociationId } from '../../application/interface/DMChannelAssociation/view/DMChannelAssociationView';
import { filterInvalidIdException } from '../../util/filterInvalidIdException';
import { idOf } from '../../util/id/idOf';
import { DMChannelAssociation } from './DMChannelAssociation';
import { DMChannelAssociationViewModel } from './DMChannelAssociationViewModel';
import { mapToDMChannelAssociationViewModel } from './mapToDMChannelAssociationViewModel';

@Resolver(() => DMChannelAssociation)
export class DMChannelAssociationResolver {
  constructor(
    private dMChannelAssociationService: DMChannelAssociationService,
  ) {}

  @Query(() => [DMChannelAssociationViewModel])
  async getChannelAssociations(
    @Arg('ids') ids: readonly string[],
  ): Promise<DMChannelAssociationViewModel[]> {
    const dMChannelAssociationIds: DMChannelAssociationId[] = ids.map((id) =>
      idOf(id),
    );
    const results = await this.dMChannelAssociationService.getMany(
      dMChannelAssociationIds,
    );
    const views = filterInvalidIdException(results);
    return views.map(mapToDMChannelAssociationViewModel);
  }

  @Query(() => DMChannelAssociationViewModel)
  async channelAssociation(
    @Arg('id') dmChannelAssociationId: string,
  ): Promise<DMChannelAssociationViewModel> {
    const result = await this.dMChannelAssociationService.findOne(
      idOf(dmChannelAssociationId),
    );
    return mapToDMChannelAssociationViewModel(result);
  }

  @Query(() => DMChannelAssociationViewModel)
  async getChannelAssociationByMemberIds(
    @Arg('member1Id') member1Id: string,
    @Arg('member2Id') member2Id: string,
  ): Promise<DMChannelAssociationViewModel> {
    const result = await this.dMChannelAssociationService.findOrCreate(
      idOf(member1Id),
      idOf(member2Id),
    );
    return mapToDMChannelAssociationViewModel(result);
  }

  // TODO: delete관련은 필요 없어보여서 아직 작성하지 않음
}
