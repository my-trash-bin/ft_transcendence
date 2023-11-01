import { InvalidIdException } from '../../../exception/InvalidIdException';
import { UserId, UserView } from './view/UserView';

export interface IUserService {
  getMany(ids: readonly UserId[]): Promise<(UserView | InvalidIdException)[]>;
}
