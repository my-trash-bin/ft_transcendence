import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { DMChannelAssociationId } from '../../interface/DMChannelAssociation/view/DMChannelAssociationView';
import { IDMMessageService } from '../../interface/DMMessage/IDMMessageService';
import {
  DMMessageId,
  DMMessageView,
} from '../../interface/DMMessage/view/DMMessageView';
import { IRepository } from '../../interface/IRepository';
import { RequestContext } from '../../RequestContext';
import { mapPrismaDMMessageToDMMessageView } from './mapPrismaDMMessageToDMMessageView';
import { prismaDMMessageSelect } from './prismaDMMessageSelect';

export class DMMessageService implements IDMMessageService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }
  async getMany(
    ids: DMMessageId[],
  ): Promise<(DMMessageView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaDMMessages = await this.repository.client.dMMessage.findMany({
      where: { id: { in: stringIds } },
      select: prismaDMMessageSelect,
    });
    return sortAs(
      prismaDMMessages.map(mapPrismaDMMessageToDMMessageView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async findOne(dmMessageId: DMMessageId): Promise<DMMessageView> {
    const prismaDMMessage = await this.repository.client.dMMessage.findUnique({
      where: { id: dmMessageId.value },
      select: prismaDMMessageSelect,
    });
    if (prismaDMMessage === null) {
      throw new InvalidIdException(dmMessageId);
    }
    return mapPrismaDMMessageToDMMessageView(prismaDMMessage);
  }

  async create(
    dmChannelId: DMChannelAssociationId,
    messageJson: string,
  ): Promise<DMMessageView> {
    const authUser = this.getAuthUserIdFromContext();
    const prismaDMMessage = await this.repository.client.dMMessage.create({
      data: {
        channelId: dmChannelId.value,
        memberId: authUser.value,
        messageJson,
      },
      select: prismaDMMessageSelect,
    });
    return mapPrismaDMMessageToDMMessageView(prismaDMMessage);
  }

  async findByChannel(
    dmChannelId: DMChannelAssociationId,
  ): Promise<DMMessageView[]> {
    const prismaDMMessages = await this.repository.client.dMMessage.findMany({
      where: { channelId: dmChannelId.value },
      select: prismaDMMessageSelect,
    });
    return prismaDMMessages.map(mapPrismaDMMessageToDMMessageView);
  }

  private getAuthUserIdFromContext() {
    const authUser = this.requestContext.user;
    if (!authUser) {
      throw new InvalidAccessException();
    }
    return authUser.id;
  }
}
