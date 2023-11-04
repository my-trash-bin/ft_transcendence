import { InvalidIdException } from '../../exception/InvalidIdException';
import { UserId, UserView } from './view/UserView';

export interface IUserService {
  getMany(
    userIds: readonly UserId[],
  ): Promise<(UserView | InvalidIdException)[]>;
}
