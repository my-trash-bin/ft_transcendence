import { Id } from '../../Id';
import { UserId } from '../../User/view/UserView';

export interface FTMetaData {
  //
}

export interface AuthViewFT {
  type: 'FT';
  id: Id<'FT'>;
  metadata: FTMetaData;
  userId: UserId;
}

export type AuthView = AuthViewFT;
