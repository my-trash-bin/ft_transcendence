import {
  PrismaUserAchievementWithAchievement,
  PrismaUserAchievementWithMainUser,
  PrismaUserAchievementWithMainUserAndAchievement,
} from './PrismaUserAchievementWithMainUserAndAchievement';

export const prismaUserAchievementWithMainUserSelect: Record<
  keyof PrismaUserAchievementWithMainUser,
  true
> = {
  user: true,
  achievedAt: true,
};

export const prismaUserAchievementWithAchievementSelect: Record<
  keyof PrismaUserAchievementWithAchievement,
  true
> = {
  achievement: true,
  achievedAt: true,
};

export const prismaUserAchievementWithMainUserAndAchievementSelect: Record<
  keyof PrismaUserAchievementWithMainUserAndAchievement,
  true
> = {
  user: true,
  achievement: true,
  achievedAt: true,
};
