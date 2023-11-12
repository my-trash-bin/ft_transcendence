import { InvalidIdException } from '../../exception/InvalidIdException';
import { AchievementId } from '../Achievement/view/AchievementView';
import { UserId } from '../User/view/UserView';
import {
  AchievementUserRelationView,
  UserAchievementDetailView,
  UserAchievementRelationView,
} from './view/UserAchievementView';

export interface IUserAchievementService {
  getUserAchievements(
    ids: readonly UserId[],
  ): Promise<(AchievementUserRelationView | InvalidIdException)[]>;
  getAchievementUsers(
    achievementId: AchievementId,
  ): Promise<UserAchievementRelationView[]>;
  assignAchievementToUser(
    userId: UserId,
    achievementId: AchievementId,
  ): Promise<UserAchievementDetailView>;
  removeUserAchievement(
    userId: UserId,
    achievementId: AchievementId,
  ): Promise<void>;
}
