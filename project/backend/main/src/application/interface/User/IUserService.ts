import { InvalidIdException } from '../../exception/InvalidIdException';
import { UserId, UserView } from './view/UserView';

// 1. 서비스 인터페이스 작성
// - 얘네만 쓰는 Exception => 같은 폴더내에서 작성
// - view 는 서비스가 있다면 무조건
// - User => DB.스키마 => Userview: 우리가 쓰기 편한.
// createFollow => 결과로 FollowView + UserView를 받아야 함 => 이 둘을 포함하는 CreateFollowResultView라는 ResultView를 만들 수 있음
// View는 다른 View를 nesting하지 않음
export interface IUserService {
  // dataloader => getMany
  // follow => 여러 친구들 => 각 유저 정보
  // 리졸버 => 각각에 대해서 호출 => 겟을 써버리면 => N개의 요청.
  // N+1 문제 해결을 위해서. => getMany만 쓰겠다.
  getMany(ids: readonly UserId[]): Promise<(UserView | InvalidIdException)[]>;
  create(nickname: string, authUserId: string): Promise<UserView>;
  updateNickname(id: UserId, nickname: string): Promise<UserView>;
  updateProfileImageUrl(
    id: UserId,
    profileImageUrl: string | null,
  ): Promise<UserView>;
}
