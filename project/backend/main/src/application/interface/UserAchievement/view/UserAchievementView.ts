import {
  AchievementId,
  AchievementView,
} from '../../Achievement/view/AchievementView';
import { UserId, UserView } from '../../User/view/UserView';

export interface UserAchievementRelationView extends UserView {
  achievedAt: Date;
}

export interface AchievementUserRelationView extends AchievementView {
  achievedAt: Date;
}

type UserDetail = Omit<UserView, 'id'>;
type AchievementDetail = Omit<AchievementView, 'id'>;

export interface UserAchievementDetailView
  extends UserDetail,
    AchievementDetail {
  userId: UserId;
  achievementId: AchievementId;
  achievedAt: Date;
}
