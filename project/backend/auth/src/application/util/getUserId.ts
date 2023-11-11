import { RequestContext } from '../RequestContext';
import { InvalidAccessException } from '../exception/InvalidAccessException';
import { UserId } from '../interface/User/view/UserView';

export function getUserId(requestContext?: RequestContext): UserId {
  if (requestContext?.isSystem || !requestContext?.user)
    throw new InvalidAccessException();
  return requestContext.user.id;
}
