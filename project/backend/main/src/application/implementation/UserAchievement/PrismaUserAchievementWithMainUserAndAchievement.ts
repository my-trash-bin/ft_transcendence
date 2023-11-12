import { Achievement, MainUser, UserAchievement } from '@prisma/client';

export type PrismaUserAchievementWithMainUserAndAchievement = Pick<
  UserAchievement,
  'achievedAt'
> & {
  user: MainUser;
  achievement: Achievement;
};

export type PrismaUserAchievementWithMainUser = Pick<
  UserAchievement,
  'achievedAt'
> & {
  user: MainUser;
};

export type PrismaUserAchievementWithAchievement = Pick<
  UserAchievement,
  'achievedAt'
> & {
  achievement: Achievement;
};
