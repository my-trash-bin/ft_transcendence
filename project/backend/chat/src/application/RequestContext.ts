import { Id } from './interface/Id';

export interface RequestContextUser {
  id: Id<'authUser'>;
}

export interface RequestContext {
  user?: RequestContextUser;
}
