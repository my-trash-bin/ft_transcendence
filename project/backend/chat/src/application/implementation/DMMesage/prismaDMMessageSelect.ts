import { PrismaDMMessage } from './PrismaDMMessage';

export const prismaDMMessageSelect: Record<keyof PrismaDMMessage, true> = {
  id: true,
  channelId: true,
  memberId: true,
  messageJson: true,
  sentAt: true,
};
