import { MainUser, UserFollow } from '@prisma/client';

export type PrismaUserFollowWithFollowee = Pick<
  UserFollow,
  'followOrBlockedAt'
> & {
  followee: MainUser;
};
