import { ChannelMemberType } from '@prisma/client';
import { ChannelMemberDetailDto } from '../channel/dto/channel-member-detail.dto';
import { ChannelMemberDto } from '../channel/dto/channel-members.dto';
import { ChannelMessageDto } from '../channel/dto/channel-message.dto';
import { ChannelDto } from '../channel/dto/channel.dto';
import { UserDto } from '../users/dto/user.dto';

export type MessageInfo = {
  id: string;
  channelId: string;
  memberId: string;
  sentAt: Date;
  messageJson: string;
};

export type DmChannelInfoType = {
  id: string;
  member1Id: string;
  member2Id: string;
};

export type ChannelMemberInfo = {
  channelId: string;
  memberId: string;
  memberType: ChannelMemberType;
  mutedUntil: Date;
};

export type JoiningChannelInfo = {
  channelMember: ChannelMemberDto;
  channel: ChannelDto;
  members: ChannelMemberDetailDto[];
  messages: (ChannelMessageDto & { member: UserDto })[];
};
