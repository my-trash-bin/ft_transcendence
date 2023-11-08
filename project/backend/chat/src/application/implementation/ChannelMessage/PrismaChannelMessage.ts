import { ChannelMessage } from '@prisma/client';

export type PrismaChannelMessage = Pick<
  ChannelMessage,
  'id' | 'channelId' | 'memberId' | 'sentAt' | 'messageJson'
>;
