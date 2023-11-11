import { ChatUser } from '@prisma/client';

export type PrismaChatUser = Pick<ChatUser, 'id' | 'authUserId'>;
