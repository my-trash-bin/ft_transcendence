import { Resolver } from '@ft_transcendence/common/di/Container';
import { getId } from '../../../util/id/getId';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IRepository } from '../../interface/IRepository';
import { IUserService } from '../../interface/User/IUserService';
import { UserId, UserView } from '../../interface/User/view/UserView';
import { invalidId } from '../../util/exception/invalidId';
import { sortAs } from '../../util/sortAs';
import { mapPrismaUserToUserView } from './mapPrismaUserToUserView';

export class UserService implements IUserService {
  private readonly repository: IRepository;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
  }

  async getMany(
    ids: readonly UserId[],
  ): Promise<(UserView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaUsers = await this.repository.client.user.findMany({
      where: { id: { in: stringIds } },
    });
    return sortAs(
      prismaUsers.map(mapPrismaUserToUserView),
      stringIds,
      getId,
      invalidId,
    );
  }
}
