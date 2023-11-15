import { Resolver } from '@ft_transcendence/common/di/Container';
import { ApplicationImports } from '../../ApplicationImports';
import { ChannelId } from '../../interface/Channel/view/ChannelView';
import { IChannelInvitationService } from '../../interface/ChannelInvitaion/IChannelInvitationService';
import { ChannelInvitationView } from '../../interface/ChannelInvitaion/view/ChannelInvitationView';
import { ChatUserId } from '../../interface/ChatUser/view/ChatUserView';
import { IRepository } from '../../interface/IRepository';
import { RequestContext } from '../../RequestContext';
import { mapPrismaChannelInvitationToChannelInvitationView } from './mapPrismaChannelInvitationToChannelInvitationView';
import { prismaChannelInvitationSelect } from './prismaChannelInvitationSelect';

export class ChannelInvitationService implements IChannelInvitationService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async addInvitation(
    channelId: ChannelId,
    memberId: ChatUserId,
  ): Promise<ChannelInvitationView> {
    // TODO: 기능고도화 > 1. 친구만 초대가능 & 2. 방이 가득차지 않아야 초대가능

    const prismaChannelMember =
      await this.repository.client.channelInvitation.create({
        data: { channelId: channelId.value, memberId: memberId.value },
        select: prismaChannelInvitationSelect,
      });
    return mapPrismaChannelInvitationToChannelInvitationView(
      prismaChannelMember,
    );
  }

  // TODO: 이게 필요한지 모르겠다. 초대 기능은 초대 생성 후, 해당 알림을 생성하고 읽음 처리하는것으로 구현 가능
  async deleteInvitation(
    channelId: ChannelId,
    memberId: ChatUserId,
  ): Promise<ChannelInvitationView> {
    const prismaChannelMember =
      await this.repository.client.channelInvitation.delete({
        where: {
          channelId_memberId: {
            channelId: channelId.value,
            memberId: memberId.value,
          },
        },
        select: prismaChannelInvitationSelect,
      });
    return mapPrismaChannelInvitationToChannelInvitationView(
      prismaChannelMember,
    );
  }
}
