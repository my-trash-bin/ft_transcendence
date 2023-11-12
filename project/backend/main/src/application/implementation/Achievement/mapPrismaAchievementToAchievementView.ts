import { idOf } from '../../../util/id/idOf';
import { AchievementView } from '../../interface/Achievement/view/AchievementView';
import { PrismaAchievement } from './PrismaAchievement';

export function mapPrismaAchievementToAchievementView({
  id,
  title,
  imageUrl,
  description,
}: PrismaAchievement): AchievementView {
  return {
    id: idOf(id),
    title,
    imageUrl,
    description,
  };
}
