import { ChatUserId } from '../../ChatUser/view/ChatUserView';
import { Id } from '../../Id';

export type ChannelId = Id<'channel'>;

export interface ChannelView {
  id: ChannelId;
  title: string;
  isPublic: boolean;
  password: string | undefined;
  createdAt: Date;
  lastActiveAt: Date;
  ownerId: ChatUserId | undefined;
  memberCount: number;
  maximumMemberCount: number;
}
