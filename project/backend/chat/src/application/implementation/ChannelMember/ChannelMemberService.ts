import { Resolver } from '@ft_transcendence/common/di/Container';
import { ChannelMemberType } from '@prisma/client';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { ChannelId } from '../../interface/Channel/view/ChannelView';
import { IChannelMemberService } from '../../interface/ChannelMember/IChannelMemberService';
import { ChannelMemberView } from '../../interface/ChannelMember/view/ChannelMemberView';
import { ChatUserId } from '../../interface/ChatUser/view/ChatUserView';
import { IRepository } from '../../interface/IRepository';
import { mapPrismaChannelMemberToChannelMemberView } from './mapPrismaChatMemberToChatMemberView';


export class ChannelMemberService implements IChannelMemberService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async create(
    channelId: ChannelId,
    memberType: ChannelMemberType
  ): Promise<ChannelMemberView> {
    const authUser = this.getAuthUserIdFromContext() // 유저가 그 방에 들어가는것이다.
    const prismaChannelMember = await this.repository.client.channelMember.create({
      data: { channelId: channelId.value , memberId: authUser.value, memberType },
    });
    return mapPrismaChannelMemberToChannelMemberView(prismaChannelMember);
  }

  async findByChannel(
    channelId: ChannelId
  ): Promise<ChannelMemberView[]> {
    const prismaChannelMembers = await this.repository.client.channelMember.findMany({
      where: { channelId: channelId.value },
    });
    return prismaChannelMembers.map(mapPrismaChannelMemberToChannelMemberView);
  }

  async findByMember(
    memberId: ChatUserId
  ): Promise<ChannelMemberView[]> {
    const prismaChannelMembers = await this.repository.client.channelMember.findMany({
      where: { memberId: memberId.value },
    });
    return prismaChannelMembers.map(mapPrismaChannelMemberToChannelMemberView);
  }

  async updateOfCreate(
    channelId: ChannelId,
    memberId: ChatUserId,
    memberType: ChannelMemberType,
    mutedUntil: Date
  ): Promise<ChannelMemberView> {
    const prismaChannelMember = await this.repository.client.channelMember.upsert({
      where: {
        channelId_memberId: {
          channelId: channelId.value,
          memberId: memberId.value,
        }
      },
      update: { memberType, mutedUntil },
      create: { channelId: channelId.value, memberId: memberId.value, memberType, mutedUntil }
    });
    return mapPrismaChannelMemberToChannelMemberView(prismaChannelMember);
  }

  async delete(
    channelId: ChannelId,
    memberId: ChatUserId,
  ): Promise<ChannelMemberView> {
    const prismaChannelMember = await this.repository.client.channelMember.delete({
      where: {
        channelId_memberId: {
          channelId: channelId.value,
          memberId: memberId.value,
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
