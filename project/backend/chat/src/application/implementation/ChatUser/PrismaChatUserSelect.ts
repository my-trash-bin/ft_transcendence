import { PrismaChatUser } from './PrismaChatUser';

export const prismaUserSelect: Record<keyof PrismaChatUser, true> = {
  id: true,
  authUserId: true,
};
