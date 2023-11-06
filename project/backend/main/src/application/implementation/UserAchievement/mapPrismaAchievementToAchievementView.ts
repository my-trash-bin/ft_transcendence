import {
  AchievementUserRelationView,
  UserAchievementDetailView,
  UserAchievementRelationView,
} from '../../interface/UserAchievement/view/UserAchievementView';
import { mapPrismaAchievementToAchievementView } from '../Achievement/mapPrismaAchievementToAchievementView';
import { mapPrismaUserToUserView } from '../User/mapPrismaUserToUserView';
import {
  PrismaUserAchievementWithAchievement,
  PrismaUserAchievementWithMainUser,
  PrismaUserAchievementWithMainUserAndAchievement,
} from './PrismaUserAchievementWithMainUserAndAchievement';

export function mapPrismaUserAchievementWithMainUserAndAchievementToUserAchievementRelationView({
  user,
  achievedAt,
}: PrismaUserAchievementWithMainUser): UserAchievementRelationView {
  return {
    ...mapPrismaUserToUserView(user),
    achievedAt,
  };
}

export function mapPrismaUserAchievementWithMainUserAndAchievementToAchievementUserRelationView({
  achievement,
  achievedAt,
}: PrismaUserAchievementWithAchievement): AchievementUserRelationView {
  return {
    ...mapPrismaAchievementToAchievementView(achievement),
    achievedAt,
  };
}

export function mapPrismaUserAchievementWithMainUserAndAchievementToUserAchievementDetailView({
  user,
  achievement,
  achievedAt,
}: PrismaUserAchievementWithMainUserAndAchievement): UserAchievementDetailView {
  const userView = mapPrismaUserToUserView(user);
  const achievementView = mapPrismaAchievementToAchievementView(achievement);
  return {
    userId: userView.id,
    authUserId: userView.authUserId,
    nickname: userView.nickname,
    profileImageUrl: userView.profileImageUrl,
    achievementId: achievementView.id,
    title: achievementView.title,
    imageUrl: achievementView.imageUrl,
    description: achievementView.description,
    achievedAt,
  };
}
