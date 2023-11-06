import { Id } from '../../Id';

export type AchievementId = Id<'achievement'>;

export interface AchievementView {
  id: AchievementId;
  title: string;
  imageUrl: string;
  description: string;
}
