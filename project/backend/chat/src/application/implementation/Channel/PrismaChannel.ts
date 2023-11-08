import { Channel } from '@prisma/client';

export type PrismaChannel = Pick<
  Channel,
  | 'id'
  | 'title'
  | 'isPublic'
  | 'password'
  | 'createdAt'
  | 'lastActiveAt'
  | 'ownerId'
  | 'memberCount'
  | 'maximumMemberCount'
>;
