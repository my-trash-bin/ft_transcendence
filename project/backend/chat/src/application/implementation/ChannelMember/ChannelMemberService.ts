import { Resolver } from '@ft_transcendence/common/di/Container';
import { ChannelMemberType } from '@prisma/client';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { IChannelMemberService } from '../../interface/ChannelMember/IChannelMemberService';
import { ChannelMemberView } from '../../interface/ChannelMember/view/ChannelMemberView';
import { IRepository } from '../../interface/IRepository';
import { mapPrismaChannelMemberToChannelMemberView } from './mapPrismaChatMemberToChatMemberView';


export class ChannelMemberService implements IChannelMemberService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async addMemberToChannel(
    channelId: string,
    memberType: ChannelMemberType
  ): Promise<ChannelMemberView> {
    const authUser = this.getAuthUserIdFromContext() // 유저가 그 방에 들어가는것이다.
    const prismaChannelMember = await this.repository.client.channelMember.create({
      data: { channelId, memberId: authUser.value, memberType },
    });
    return mapPrismaChannelMemberToChannelMemberView(prismaChannelMember);
  }

  async getMembersByChannel(
    channelId: string
  ): Promise<ChannelMemberView[]> {
    const prismaChannelMembers = await this.repository.client.channelMember.findMany({
      where: { channelId },
    });
    return prismaChannelMembers.map(mapPrismaChannelMemberToChannelMemberView);
  }

  async getChannelsByMember(
    memberId: string
  ): Promise<ChannelMemberView[]> {
    const prismaChannelMembers = await this.repository.client.channelMember.findMany({
      where: { memberId },
    });
    return prismaChannelMembers.map(mapPrismaChannelMemberToChannelMemberView);
  }

  async updateMemberStatus(
    channelId: string,
    memberId: string,
    memberType: ChannelMemberType,
    mutedUntil: Date
  ): Promise<ChannelMemberView> {
    const prismaChannelMember = await this.repository.client.channelMember.upsert({
      where: {
        channelId_memberId: {
          channelId,
          memberId
        }
      },
      update: { memberType, mutedUntil },
      create: { channelId, memberId, memberType, mutedUntil }
    });
    return mapPrismaChannelMemberToChannelMemberView(prismaChannelMember);
  }

  async removeMemberFromChannel(
    channelId: string,
    memberId: string,
  ): Promise<ChannelMemberView> {
    const prismaChannelMember = await this.repository.client.channelMember.delete({
      where: {
        channelId_memberId: {
          channelId,
          memberId
        }
      }
    });
    return mapPrismaChannelMemberToChannelMemberView(prismaChannelMember);
  }

  private getAuthUserIdFromContext() {
    const authUser = this.requestContext.user;
    if (!authUser) {
      throw new InvalidAccessException();
    }
    return authUser.id;
  }

}
