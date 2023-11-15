import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { ChannelId } from '../../interface/Channel/view/ChannelView';
import { IChannelMessageService } from '../../interface/ChannelMessage/IChannelMessageService';
import {
  ChannelMessageId,
  ChannelMessageView,
} from '../../interface/ChannelMessage/view/ChannelMessageView';
import { ChatUserId } from '../../interface/ChatUser/view/ChatUserView';
import { IRepository } from '../../interface/IRepository';
import { RequestContext } from '../../RequestContext';
import { mapPrismaChannelMessageToChannelMessageView } from './mapPrismaChannelMessageToChannelMessageView';
import { prismaChannelMessageSelect } from './PrismaChannelMessageSelect';

export class ChannelMessageService implements IChannelMessageService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: ChannelMessageId[],
  ): Promise<(ChannelMessageView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaChannelMessages =
      await this.repository.client.channelMessage.findMany({
        where: { id: { in: stringIds } },
        select: prismaChannelMessageSelect,
      });
    return sortAs(
      prismaChannelMessages.map(mapPrismaChannelMessageToChannelMessageView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async create(
    channelId: ChannelId,
    messageJson: string,
  ): Promise<ChannelMessageView> {
    const authUser = this.getAuthUserIdFromContext();
    const prismaChannelMessage =
      await this.repository.client.channelMessage.create({
        data: {
          channelId: channelId.value,
          memberId: authUser.value,
          messageJson,
        },
        select: prismaChannelMessageSelect,
      });
    return mapPrismaChannelMessageToChannelMessageView(prismaChannelMessage);
  }

  async findByChannel(channelId: ChannelId): Promise<ChannelMessageView[]> {
    const prismaChannelMessages =
      await this.repository.client.channelMessage.findMany({
        where: { channelId: channelId.value },
        select: prismaChannelMessageSelect,
      });
    return prismaChannelMessages.map(
      mapPrismaChannelMessageToChannelMessageView,
    );
  }

  async findByMember(memberId: ChatUserId): Promise<ChannelMessageView[]> {
    const prismaChannelMessages =
      await this.repository.client.channelMessage.findMany({
        where: { memberId: memberId.value },
        select: prismaChannelMessageSelect,
      });
    return prismaChannelMessages.map(
      mapPrismaChannelMessageToChannelMessageView,
    );
  }

  private getAuthUserIdFromContext() {
    const authUser = this.requestContext.user;
    if (!authUser) {
      throw new InvalidAccessException();
    }
    return authUser.id;
  }
}
