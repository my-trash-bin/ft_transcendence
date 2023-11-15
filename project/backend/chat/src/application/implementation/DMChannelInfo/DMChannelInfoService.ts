import { Resolver } from '@ft_transcendence/common/di/Container';
import { ApplicationImports } from '../../ApplicationImports';
import { ChatUserId } from '../../interface/ChatUser/view/ChatUserView';
import { IDMChannelInfoService } from '../../interface/DMChannelInfo/IDMChannelInfoService';
import { DMChannelInfoView } from '../../interface/DMChannelInfo/view/DMChannelInfoView';
import { IRepository } from '../../interface/IRepository';
import { RequestContext } from '../../RequestContext';
import { mapPrismaDMChannelInfoToDMChannelInfoView } from './mapPrismaDMChannelInfoToDMChannelInfoView';

export class DMChannelInfoService implements IDMChannelInfoService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async findOrCreate(
    fromId: ChatUserId,
    toId: ChatUserId,
    name = 'DM Channel',
  ): Promise<DMChannelInfoView> {
    // TODO: name의 정체?
    let member1Id, member2Id;
    if (fromId.value < toId.value) {
      member1Id = fromId;
      member2Id = toId;
    } else {
      member1Id = toId;
      member2Id = fromId;
    }
    const channelAssociation =
      await this.repository.client.dMChannelAssociation.upsert({
        where: {
          member1Id_member2Id: {
            member1Id: member1Id.value,
            member2Id: member2Id.value,
          },
        },
        update: {},
        create: {
          member1Id: member1Id.value,
          member2Id: member2Id.value,
        },
      });
    const dmChannelInfo = await this.repository.client.dMChannelInfo.upsert({
      where: {
        fromId_toId: {
          fromId: fromId.value,
          toId: toId.value,
        },
      },
      update: {},
      create: {
        fromId: fromId.value,
        toId: toId.value,
        channelId: channelAssociation.id,
        name,
      },
    });
    return mapPrismaDMChannelInfoToDMChannelInfoView(dmChannelInfo);
  }

  async delete(
    fromId: ChatUserId,
    toId: ChatUserId,
  ): Promise<DMChannelInfoView> {
    const dmChannelInfo = await this.repository.client.dMChannelInfo.delete({
      where: {
        fromId_toId: {
          fromId: fromId.value,
          toId: toId.value,
        },
      },
    });
    return mapPrismaDMChannelInfoToDMChannelInfoView(dmChannelInfo);
  }
}
