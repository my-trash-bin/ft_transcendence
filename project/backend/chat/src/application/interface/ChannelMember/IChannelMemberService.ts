import { ChannelMemberType } from '@prisma/client';
import { ChannelMemberView } from './view/ChannelMemberView';

export interface IChannelMemberService {

  addMemberToChannel(
    channelId: string,
    memberType: ChannelMemberType
  ): Promise<ChannelMemberView>;

  getMembersByChannel(
    channelId: string
  ): Promise<ChannelMemberView[]>;
  
  getChannelsByMember(
    memberId: string
  ): Promise<ChannelMemberView[]>;

  updateMemberStatus(
    channelId: string,
    memberId: string,
    memberType: ChannelMemberType,
    mutedUntil: Date
  ): Promise<ChannelMemberView>;
  
  removeMemberFromChannel(
    channelId: string,
    memberId: string,
    memberType: ChannelMemberType
  ): Promise<ChannelMemberView>;
}
