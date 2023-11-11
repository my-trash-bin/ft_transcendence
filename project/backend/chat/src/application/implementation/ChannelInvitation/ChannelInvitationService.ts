import { Resolver } from '@ft_transcendence/common/di/Container';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { ChannelId } from "../../interface/Channel/view/ChannelView";
import { IChannelInvitationService } from "../../interface/ChannelInvitaion/IChannelInvitationService";
import { ChannelInvitationView } from "../../interface/ChannelInvitaion/view/ChannelInvitationView";
import { ChatUserId } from "../../interface/ChatUser/view/ChatUserView";
import { IRepository } from '../../interface/IRepository';
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
    const prismaChannelMember = await this.repository.client.channelInvitation.create({
      data: { channelId: channelId.value, memberId: memberId.value },
      select: prismaChannelInvitationSelect
    });
    return mapPrismaChannelInvitationToChannelInvitationView(prismaChannelMember)
  }
  
  async deleteInvitation(
    channelId: ChannelId,
    memberId: ChatUserId, 
  ): Promise<ChannelInvitationView> {
    const prismaChannelMember = await this.repository.client.channelInvitation.delete({
      where: {
        channelId_memberId: {
          channelId: channelId.value,
          memberId: memberId.value
        }
      },
      select: prismaChannelInvitationSelect
    });
    return mapPrismaChannelInvitationToChannelInvitationView(prismaChannelMember)
  }
}
