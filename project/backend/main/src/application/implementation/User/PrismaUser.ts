import { MainUser } from '@prisma/client';

export type PrismaUser = Pick<
  MainUser,
  'id' | 'authUserId' | 'nickname' | 'profileImageUrl'
>;
