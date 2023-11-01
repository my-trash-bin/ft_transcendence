import { PrismaUser } from './PrismaUser';

export const prismaUserSelect: Record<keyof PrismaUser, true> = {
  id: true,
  nickname: true,
  profileImageUrl: true,
  joinedAt: true,
  leavedAt: true,
};
