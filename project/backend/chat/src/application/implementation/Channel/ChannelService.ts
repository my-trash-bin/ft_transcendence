import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { CreateChannelInfo, IChannelService } from '../../interface/Channel/IChannelService';
import { ChannelId, ChannelView } from '../../interface/Channel/view/ChannelView';
import { IRepository } from '../../interface/IRepository';
import { mapPrismaChannelToChannelView } from './mapPrismaChannelToChannelView';

// npx prisma generate 해야됌~

export class ChannelService implements IChannelService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: readonly ChannelId[]
  ): Promise<(ChannelView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaUsers = await this.repository.client.channel.findMany({
      where: { id: { in: stringIds } },
    });
    return sortAs(
      prismaUsers.map(mapPrismaChannelToChannelView),
      stringIds,
      getId,
      invalidId
    );
  }

  async create({
    title,
    isPublic,
    password,
    ownerId,
    memberCount,
    maximumMemberCount,
  }: CreateChannelInfo): Promise<ChannelView> {
    const prismaUser = await this.repository.client.channel.create({
      data: {
        title,
        isPublic,
        password,
        ownerId,
        memberCount,
        maximumMemberCount,
      },
    });
    return mapPrismaChannelToChannelView(prismaUser);
  }
}
