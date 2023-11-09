import { InvalidIdException } from '../../exception/InvalidIdException';
import { ChannelId, ChannelView } from './view/ChannelView';

export type CreateChannelInfo = {
  title: string;
  isPublic: boolean;
  password?: string;
  ownerId?: string;
  memberCount: number,
  maximumMemberCount: number;
};

export interface IChannelService {
  getMany(
    ids: readonly ChannelId[],
  ): Promise<(ChannelView | InvalidIdException)[]>;
  create(
    createChannelInfo: CreateChannelInfo,
  ): Promise<ChannelView>;
}
