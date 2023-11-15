import { DMMessage } from '@prisma/client';

export type PrismaDMMessage = Pick<
  DMMessage,
  'id' | 'channelId' | 'memberId' | 'messageJson' | 'sentAt'
>;
