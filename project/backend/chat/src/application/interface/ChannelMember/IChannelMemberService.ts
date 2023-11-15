import { ChannelMemberType } from '@prisma/client';
import { ChannelId } from '../Channel/view/ChannelView';
import { ChatUserId } from '../ChatUser/view/ChatUserView';
import { ChannelMemberView } from './view/ChannelMemberView';

export interface IChannelMemberService {
  create(
    channelId: ChannelId,
    memberType: ChannelMemberType,
  ): Promise<ChannelMemberView>;

  findByChannel(channelId: ChannelId): Promise<ChannelMemberView[]>;

  findByMember(memberId: ChatUserId): Promise<ChannelMemberView[]>;

  update(
    channelId: ChannelId,
    memberId: ChatUserId,
    memberType: ChannelMemberType,
    mutedUntil: Date,
  ): Promise<ChannelMemberView>;

  updateOrCreate(
    channelId: ChannelId,
    memberId: ChatUserId,
    memberType: ChannelMemberType,
    mutedUntil: Date,
  ): Promise<ChannelMemberView>;

  delete(
    channelId: ChannelId,
    memberId: ChatUserId,
  ): Promise<ChannelMemberView>;
}
