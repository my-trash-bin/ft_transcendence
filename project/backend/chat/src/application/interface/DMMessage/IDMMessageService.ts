import { InvalidIdException } from '../../exception/InvalidIdException';
import { DMChannelAssociationId } from '../DMChannelAssociation/view/DMChannelAssociationView';
import { DMMessageId, DMMessageView } from './view/DMMessageView';

export interface IDMMessageService {
  getMany(ids: DMMessageId[]): Promise<(DMMessageView | InvalidIdException)[]>;

  findOne(dmMessageId: DMMessageId): Promise<DMMessageView>;

  create(
    dmChannelId: DMChannelAssociationId,
    messageJson: string,
  ): Promise<DMMessageView>;

  findByChannel(dmChannelId: DMChannelAssociationId): Promise<DMMessageView[]>;
}
