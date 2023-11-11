import { PrismaChannelMessage } from './PrismaChannelMessage';

export const prismaChannelMessageSelect:
  Record<keyof PrismaChannelMessage, true> = {
  id: true,
  channelId: true,
  memberId: true,
  sentAt: true,
  messageJson: true,
};



