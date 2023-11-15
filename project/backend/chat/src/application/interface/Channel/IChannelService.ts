import { InvalidIdException } from '../../exception/InvalidIdException';
import { ChannelId, ChannelView } from './view/ChannelView';

export type CreateChannelInfo = {
  title: string;
  isPublic: boolean;
  password: string | null;
  maximumMemberCount: number;
};

export interface IChannelService {
  getMany(
    ids: readonly ChannelId[],
  ): Promise<(ChannelView | InvalidIdException)[]>;
  allChannel(skip?: number, take?: number): Promise<ChannelView[]>;
  create(createChannelInfo: CreateChannelInfo): Promise<ChannelView>;
  updateOptions(
    id: ChannelId,
    title?: string,
    isPublic?: boolean,
    password?: string | null,
    maximumMemberCount?: number,
  ): Promise<ChannelView>;
  updateState(
    id: ChannelId,
    ownerId?: string | null,
    memberCount?: number,
  ): Promise<ChannelView>;
  delete(id: ChannelId): Promise<ChannelView>;
}
