import {
  PrismaUserFollowWithFollowee,
  PrismaUserFollowWithFollower,
} from './PrismaUserFollowWithMainUser';

export const prismaUserFollowWithFolloweeSelect: Record<
  keyof PrismaUserFollowWithFollowee,
  true
> = {
  followOrBlockedAt: true,
  followee: true,
};

export const prismaUserFollowWithFollowerSelect: Record<
  keyof PrismaUserFollowWithFollower,
  true
> = {
  followOrBlockedAt: true,
  follower: true,
};
