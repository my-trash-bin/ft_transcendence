import { RequestContextUser } from '../application/RequestContext';

export interface JwtPayload {
  user: RequestContextUser;
}
