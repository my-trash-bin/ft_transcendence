import { UserView } from '../../../main/application/interface/User/view/UserView';
import { GraphqlUser } from './GraphqlUser';

export function mapUserViewToGraphqlUser(userView: UserView): GraphqlUser {
  return {
    ...userView,
    id: userView.id.value,
  };
}
