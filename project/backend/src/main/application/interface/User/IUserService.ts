import { InvalidIdException } from '../../../exception/InvalidIdException';
import { UserId, UserView } from './view/UserView';

export interface IUserService {
  getMany(ids: readonly UserId[]): Promise<(UserView | InvalidIdException)[]>;
  create(nickname: string): Promise<UserView>;
  updateNickname(id: UserId, nickname: string): Promise<UserView>;
  updateProfileImageUrl(
    id: UserId,
    profileImageUrl: string | null,
  ): Promise<UserView>;
  delete(id: UserId): Promise<void>;
}
