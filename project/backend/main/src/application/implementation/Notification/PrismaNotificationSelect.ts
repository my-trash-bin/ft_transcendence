import { PrismaNotification } from './PrismaNotification';

export const prismaUserSelect: Record<keyof PrismaNotification, true> = {
  id: true,
  userId: true,
  isRead: true,
  createdAt: true,
  contentJson: true,
};
