import { AuthType } from '@prisma/client';
import { Id } from '../Id';
import { AuthView, AuthViewFT } from './view/AuthView';

export type AuthTypeToAuthView<T extends AuthType> = {
  FT: AuthViewFT;
}[T];

export interface IAuthService {
  get(type: AuthType, id: string): Promise<AuthView>;
  getOrCreate<T extends AuthType>(
    type: T,
    id: string,
    metadataJson: string,
  ): Promise<AuthTypeToAuthView<T>>;
  getOrCreateFT(ftId: Id<'FT'>, metadataJson: string): Promise<AuthViewFT>;
}
