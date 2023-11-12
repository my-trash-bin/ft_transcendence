import { Resolver } from '@ft_transcendence/common/di/Container';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IAchievementService } from '../../interface/Achievement/IAchievementService';
import {
  AchievementId,
  AchievementView,
} from '../../interface/Achievement/view/AchievementView';
import { IRepository } from '../../interface/IRepository';
import { invalidId } from '../../util/exception/invalidId';
import { mapPrismaAchievementToAchievementView } from './mapPrismaAchievementToAchievementView';

export class AchievementService implements IAchievementService {
  private readonly repository: IRepository;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
  }

  async getMany(
    ids: readonly AchievementId[],
  ): Promise<(AchievementView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaAchievements =
      await this.repository.client.achievement.findMany({
        where: { id: { in: stringIds } },
      });
    return sortAs(
      prismaAchievements.map(mapPrismaAchievementToAchievementView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async getAllAchievements(): Promise<AchievementView[]> {
    const prismaAchievements =
      await this.repository.client.achievement.findMany();
    return prismaAchievements.map(mapPrismaAchievementToAchievementView);
  }

  async create(
    title: string,
    imageUrl: string,
    description: string,
  ): Promise<AchievementView> {
    const prismaAchievement = await this.repository.client.achievement.create({
      data: { title, imageUrl, description },
    });
    return mapPrismaAchievementToAchievementView(prismaAchievement);
  }

  async update(
    id: AchievementId,
    title: string,
    imageUrl: string,
    description: string,
  ): Promise<AchievementView> {
    const prismaAchievement = await this.repository.client.achievement.update({
      where: { id: id.value },
      data: { title, imageUrl, description },
    });
    return mapPrismaAchievementToAchievementView(prismaAchievement);
  }

  async delete(id: AchievementId): Promise<void> {
    await this.repository.client.achievement.delete({
      where: { id: id.value },
    });
  }
}
