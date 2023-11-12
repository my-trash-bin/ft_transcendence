import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { ChatUserId } from '../../interface/ChatUser/view/ChatUserView';
import { IDMChannelAssociationService } from "../../interface/DMChannelAssociation/IDMChannelAssociationService";
import { DMChannelAssociationId, DMChannelAssociationView } from '../../interface/DMChannelAssociation/view/DMChannelAssociationView';
import { IRepository } from '../../interface/IRepository';
import { mapPrismaDMChannelAssociationToDMChannelAssociationView } from './mapPrismaDMChannelAssociationToDMChannelAssociationView';
import { prismaDMChannelAssociationSelect } from './prismaDMChannelAssociationSelect';

export class DMChannelAssociationService implements IDMChannelAssociationService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: ChatUserId[]
  ): Promise<(DMChannelAssociationView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaDMChannelAssociations = await this.repository.client.dMChannelAssociation.findMany({
      where: { id: { in: stringIds } },
      select: prismaDMChannelAssociationSelect,
    });
    return sortAs(
      prismaDMChannelAssociations.map(mapPrismaDMChannelAssociationToDMChannelAssociationView),
      stringIds,
      getId,
      invalidId,
    );
  }
  async findOrCreate(
    member1Id: ChatUserId,
    member2Id: ChatUserId,
  ): Promise<DMChannelAssociationView> {
    if (member1Id.value > member2Id.value) {
      [member1Id, member2Id] = [member2Id, member1Id]; // ID 교환
    }
    const dmChannelAssociation = await this.repository.client.dMChannelAssociation.upsert({
      where: {
        member1Id_member2Id: {
          member1Id: member1Id.value,
          member2Id: member2Id.value
        }
      },
      update: {
      },
      create: {
        member1Id: member1Id.value,
        member2Id: member2Id.value
      },
      select: prismaDMChannelAssociationSelect,
    });
    return mapPrismaDMChannelAssociationToDMChannelAssociationView(dmChannelAssociation);
  }
  async deleteByMemberId(
    member1Id: ChatUserId,
    member2Id: ChatUserId
  ):Promise<DMChannelAssociationView> {
    const dmChannelAssociation = await this.repository.client.dMChannelAssociation.delete({
      where: { member1Id_member2Id: { 
        member1Id: member1Id.value,
        member2Id: member2Id.value
      }},
      select: prismaDMChannelAssociationSelect,
    });
    return mapPrismaDMChannelAssociationToDMChannelAssociationView(dmChannelAssociation);
  }
  async deleteByDMChannelAssociationId(
    id: DMChannelAssociationId
  ):Promise<DMChannelAssociationView> {
    const dmChannelAssociation = await this.repository.client.dMChannelAssociation.delete({
      where: { id: id.value },
      select: prismaDMChannelAssociationSelect,
    });
    return mapPrismaDMChannelAssociationToDMChannelAssociationView(dmChannelAssociation);
  }
}