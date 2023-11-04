import { UserId } from './interface/User/view/UserView';

export interface RequestContextUser {
  id: UserId;
}

export interface RequestContextForUser {
  isSystem: false;
  user?: RequestContextUser;
}

export interface RequestContextForSystem {
  isSystem: true;
}

export type RequestContext = RequestContextForUser | RequestContextForSystem;
