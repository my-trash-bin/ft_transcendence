import { PrismaChannel } from './PrismaChannel';

export const prismaChannelSelect: Record<keyof PrismaChannel, boolean> = {
  id: true,
  title: true,
  isPublic: true,
  password: false,
  createdAt: true,
  lastActiveAt: true,
  ownerId: true,
  memberCount: true,
  maximumMemberCount: true,
};
