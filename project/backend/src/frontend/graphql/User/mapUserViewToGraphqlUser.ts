import { UserView } from '../../../application/basic/User/UserView';
import { GraphqlUser } from './GraphqlUser';

export function mapUserViewToGraphqlUser(userView: UserView): GraphqlUser {
  return {
    ...userView,
    id: userView.id.value,
  };
}
