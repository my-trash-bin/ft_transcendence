import { Resolver } from '@ft_transcendence/common/di/Container';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { AchievementId } from '../../interface/Achievement/view/AchievementView';
import { IRepository } from '../../interface/IRepository';
import { UserId } from '../../interface/User/view/UserView';
import { IUserAchievementService } from '../../interface/UserAchievement/IUserAchievementService';
import {
  AchievementUserRelationView,
  UserAchievementDetailView,
  UserAchievementRelationView,
} from '../../interface/UserAchievement/view/UserAchievementView';
import { RequestContext } from '../../RequestContext';
import { invalidId } from '../../util/exception/invalidId';
import {
  mapPrismaUserAchievementWithMainUserAndAchievementToAchievementUserRelationView,
  mapPrismaUserAchievementWithMainUserAndAchievementToUserAchievementDetailView,
  mapPrismaUserAchievementWithMainUserAndAchievementToUserAchievementRelationView,
} from './mapPrismaAchievementToAchievementView';
import {
  prismaUserAchievementWithAchievementSelect,
  prismaUserAchievementWithMainUserAndAchievementSelect,
  prismaUserAchievementWithMainUserSelect,
} from './prismaUserAchievementSelect';

export class UserAchievementService implements IUserAchievementService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getUserAchievements(
    userIds: readonly UserId[],
  ): Promise<(AchievementUserRelationView | InvalidIdException)[]> {
    const stringIds = userIds.map(({ value }) => value);
    const userAchievements =
      await this.repository.client.userAchievement.findMany({
        where: { userId: { in: stringIds } },
        select: prismaUserAchievementWithAchievementSelect,
      });

    return sortAs(
      userAchievements.map(
        mapPrismaUserAchievementWithMainUserAndAchievementToAchievementUserRelationView,
      ),
      stringIds,
      getId,
      invalidId,
    );
  }

  async getAchievementUsers(
    achievementId: AchievementId,
  ): Promise<UserAchievementRelationView[]> {
    const users = await this.repository.client.userAchievement.findMany({
      where: { achievementId: achievementId.value },
      select: prismaUserAchievementWithMainUserSelect,
    });
    return users.map(
      mapPrismaUserAchievementWithMainUserAndAchievementToUserAchievementRelationView,
    );
  }

  async assignAchievementToUser(
    userId: UserId,
    achievementId: AchievementId,
  ): Promise<UserAchievementDetailView> {
    const record = await this.repository.client.userAchievement.create({
      data: {
        userId: userId.value,
        achievementId: achievementId.value,
      },
      select: prismaUserAchievementWithMainUserAndAchievementSelect,
    });
    return mapPrismaUserAchievementWithMainUserAndAchievementToUserAchievementDetailView(
      record,
    );
  }

  async removeUserAchievement(
    userId: UserId,
    achievementId: AchievementId,
  ): Promise<void> {
    await this.repository.client.userAchievement.delete({
      where: {
        userId_achievementId: {
          userId: userId.value,
          achievementId: achievementId.value,
        },
      },
    });
  }
}
