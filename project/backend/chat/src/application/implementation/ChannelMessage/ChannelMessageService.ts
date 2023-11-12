import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IChannelMessageService } from '../../interface/ChannelMessage/IChannelMessageService';
import { ChannelMessageId, ChannelMessageView } from '../../interface/ChannelMessage/view/ChannelMessageView';
import { IRepository } from '../../interface/IRepository';
import { prismaChannelMessageSelect } from './PrismaChannelMessageSelect';
import { mapPrismaChannelMessageToChannelMessageView } from './mapPrismaChannelMessageToChannelMessageView';


export class ChannelMessageService implements IChannelMessageService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: ChannelMessageId[]
  ): Promise<(ChannelMessageView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaChannelMessages = await this.repository.client.channelMessage.findMany({
      where: { id: { in: stringIds } },
      select: prismaChannelMessageSelect
    });
    return sortAs(
      prismaChannelMessages.map(mapPrismaChannelMessageToChannelMessageView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async sendMessageToChannel(
    channelId: string,
    messageJson: string
  ): Promise<ChannelMessageView> {
    const authUser = this.getAuthUserIdFromContext();
    const prismaChannelMessage = await this.repository.client.channelMessage.create({
      data: { channelId, memberId: authUser.value, messageJson },
      select: prismaChannelMessageSelect
    })
    return mapPrismaChannelMessageToChannelMessageView(prismaChannelMessage);
  }
  
  async getMessagesByChannel(
    channelId: string
  ): Promise<ChannelMessageView[]> {
    const prismaChannelMessagesList = await this.repository.client.channelMessage.findMany({
      where: { channelId },
      select: prismaChannelMessageSelect
    })
    return prismaChannelMessagesList.map(mapPrismaChannelMessageToChannelMessageView);
  }
  
  async getMessagesByMember(
    memberId: string
  ): Promise<ChannelMessageView[]> {
    const prismaChannelMessagesList = await this.repository.client.channelMessage.findMany({
      where: { memberId },
      select: prismaChannelMessageSelect
    })
    return prismaChannelMessagesList.map(mapPrismaChannelMessageToChannelMessageView);
  }

  private getAuthUserIdFromContext() {
    const authUser = this.requestContext.user;
    if (!authUser) {
      throw new InvalidAccessException();
    }
    return authUser.id;
  }

}
