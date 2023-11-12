import { PrismaChannel } from './PrismaChannel';

export const prismaChannelSelect: Record<keyof PrismaChannel, true> = {
  id: true,
  title: true,
  isPublic: true,
  password: true,
  createdAt: true,
  lastActiveAt: true,
  ownerId: true,
  memberCount: true,
  maximumMemberCount: true
};
