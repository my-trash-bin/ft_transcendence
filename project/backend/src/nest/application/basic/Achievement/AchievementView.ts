import { Id } from '../../util/id/Id';

export type AchievementId = Id<'Achievement'>;

export interface AchievementView {
  id: AchievementId;
  title: string;
  imageUrl: string;
  description: string;
}
