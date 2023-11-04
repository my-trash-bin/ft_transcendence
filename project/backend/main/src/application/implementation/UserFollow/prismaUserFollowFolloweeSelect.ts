import { PrismaUserFollowWithFollowee } from "./PrismaUserFollowWithMainUser";

export const prismaUserFollowWithFolloweeSelect:
  Record<keyof PrismaUserFollowWithFollowee, true> = {
  followOrBlockedAt: true,
  followee: true,
};
