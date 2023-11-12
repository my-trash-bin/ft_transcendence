import { Notification } from '@prisma/client';

export type PrismaNotification = Pick<
  Notification,
  'id' | 'userId' | 'isRead' | 'createdAt' | 'contentJson'
>;
