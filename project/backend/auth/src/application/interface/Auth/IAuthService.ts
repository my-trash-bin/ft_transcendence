import { AuthType } from '@prisma/client';
import { Id } from '../Id';
import { UserId } from '../User/view/UserView';
import { AuthView, AuthViewFT } from './view/AuthView';

export type AuthTypeToAuthView<T extends AuthType> = {
  FT: AuthViewFT;
}[T];

export interface IAuthService {
  getById(id: UserId): Promise<AuthView>;
  get(type: AuthType, id: string): Promise<AuthView>;
  upsert<T extends AuthType>(
    type: T,
    id: string,
    metadataJson: string,
  ): Promise<AuthTypeToAuthView<T>>;
  upsertFT(ftId: Id<'FT'>, metadataJson: string): Promise<AuthViewFT>;
}
