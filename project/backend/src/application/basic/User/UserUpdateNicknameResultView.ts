import { ResultView } from '../../util/ResultView';
import { UserView } from './UserView';

export type UserUpdateNicknameResultView = ResultView<
  UserView,
  'userView',
  never
>;
