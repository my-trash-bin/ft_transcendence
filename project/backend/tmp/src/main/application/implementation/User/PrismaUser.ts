import { User } from '@prisma/client';

export type PrismaUser = Pick<
  User,
  'id' | 'nickname' | 'profileImageUrl' | 'joinedAt' | 'leavedAt'
>;
