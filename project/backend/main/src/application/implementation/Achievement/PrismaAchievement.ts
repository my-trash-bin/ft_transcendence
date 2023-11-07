import { Achievement } from '@prisma/client';

export type PrismaAchievement = Pick<
  Achievement,
  'id' | 'title' | 'imageUrl' | 'description'
>;
