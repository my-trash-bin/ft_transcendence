import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import {
  CreateChannelInfo,
  IChannelService,
} from '../../interface/Channel/IChannelService';
import {
  ChannelId,
  ChannelView,
} from '../../interface/Channel/view/ChannelView';
import { IRepository } from '../../interface/IRepository';
import { RequestContext } from '../../RequestContext';
import { mapPrismaChannelToChannelView } from './mapPrismaChannelToChannelView';
import { prismaChannelSelect } from './PrismaChannelSelect';

// npx prisma generate 해야됌~

export class ChannelService implements IChannelService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: readonly ChannelId[],
  ): Promise<(ChannelView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaChannels = await this.repository.client.channel.findMany({
      where: { id: { in: stringIds } },
      select: prismaChannelSelect,
    });
    return sortAs(
      prismaChannels.map(mapPrismaChannelToChannelView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async allChannel(skip?: number, take?: number): Promise<ChannelView[]> {
    const prismaChannels = await this.repository.client.channel.findMany({
      skip,
      take,
      select: prismaChannelSelect,
    });
    return prismaChannels.map(mapPrismaChannelToChannelView);
  }

  async create({
    title,
    isPublic,
    password,
    maximumMemberCount,
  }: CreateChannelInfo): Promise<ChannelView> {
    const authUser = this.getAuthUserIdFromContext();
    const initMemberCount = 1;
    const prismaChannel = await this.repository.client.channel.create({
      data: {
        title,
        isPublic,
        password,
        ownerId: authUser.value,
        memberCount: initMemberCount,
        maximumMemberCount,
      },
      select: prismaChannelSelect,
    });
    return mapPrismaChannelToChannelView(prismaChannel);
  }

  async updateOptions(
    id: ChannelId,
    title?: string,
    isPublic?: boolean,
    password?: string | null,
    maximumMemberCount?: number,
  ): Promise<ChannelView> {
    const prismaChannel = await this.repository.client.channel.update({
      where: { id: id.value },
      data: {
        title,
        isPublic,
        password,
        maximumMemberCount,
      },
      select: prismaChannelSelect,
    });
    return mapPrismaChannelToChannelView(prismaChannel);
  }

  async updateState(
    id: ChannelId,
    ownerId?: string | null,
    memberCount?: number,
  ): Promise<ChannelView> {
    const prismaChannel = await this.repository.client.channel.update({
      where: { id: id.value },
      data: {
        lastActiveAt: new Date(),
        ownerId,
        memberCount,
      },
      select: prismaChannelSelect,
    });
    return mapPrismaChannelToChannelView(prismaChannel);
  }

  async delete(id: ChannelId) {
    const prismaChannel = await this.repository.client.channel.delete({
      where: { id: id.value },
      select: prismaChannelSelect,
    });
    return mapPrismaChannelToChannelView(prismaChannel);
  }

  private getAuthUserIdFromContext() {
    const authUser = this.requestContext.user;
    if (!authUser) {
      throw new InvalidAccessException();
    }
    return authUser.id;
  }
}
