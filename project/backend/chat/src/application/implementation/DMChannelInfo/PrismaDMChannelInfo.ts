import { DMChannelInfo } from '@prisma/client';

export type PrismaDMChannelInfo = Pick<
  DMChannelInfo,
  'channelId' | 'fromId' | 'name' | 'toId'
>;
