import { PrismaUser } from './PrismaUser';

export const prismaUserSelect: Record<keyof PrismaUser, true> = {
  id: true,
  authUserId: true,
  nickname: true,
  profileImageUrl: true,
};
