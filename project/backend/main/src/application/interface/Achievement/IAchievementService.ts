import { InvalidIdException } from '../../exception/InvalidIdException';
import { AchievementId, AchievementView } from './view/AchievementView';

export interface IAchievementService {
  getMany(
    ids: readonly AchievementId[],
  ): Promise<(AchievementView | InvalidIdException)[]>;
  getAllAchievements(): Promise<AchievementView[]>;
  create(
    title: string,
    imageUrl: string,
    description: string,
  ): Promise<AchievementView>;
  update(
    id: AchievementId,
    title: string,
    imageUrl: string,
    description: string,
  ): Promise<AchievementView>;
  delete(id: AchievementId): Promise<void>;
}
