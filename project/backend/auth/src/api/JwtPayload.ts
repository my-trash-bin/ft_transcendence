import { RequestContextUser } from '../application/RequestContext';

import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends BaseJwtPayload {
  user: RequestContextUser;
}
