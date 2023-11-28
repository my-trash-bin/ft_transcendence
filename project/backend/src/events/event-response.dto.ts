import { ChannelMemberType } from '@prisma/client';

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

type ChannelInfo = {
  id: string;
  title: string;
  isPublic: boolean;
  password: string | null;
  createdAt: Date;
  lastActiveAt: Date;
  ownerId: string | null;
  memberCount: number;
  maximumMemberCount: number;
};

export type ChannelMemberInfo = {
  channelId: string;
  memberId: string;
  memberType: ChannelMemberType;
  mutedUntil: Date;
};

export type JoiningChannelInfo = {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  ownerId: string | null;
  memberCount: number;
  maximumMemberCount: number;
  members: {
    memberId: string;
    memberType: ChannelMemberType;
    mutedUntil: Date;
    member: {
      id: string;
      nickname: string;
      profileImageUrl: string | null;
    };
  }[];
};

export type LeavingChannelInfo = {
  id: string;
  title: string;
  isPublic: boolean;
  password: string | null;
  createdAt: Date;
  lastActiveAt: Date;
  ownerId: string | null;
  memberCount: number;
  maximumMemberCount: number;
};
