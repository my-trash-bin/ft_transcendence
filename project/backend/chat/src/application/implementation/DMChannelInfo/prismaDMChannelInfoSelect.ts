import { PrismaDMChannelInfo } from './PrismaDMChannelInfo';

export const prismaDMChannelInfoSelect: Record<
  keyof PrismaDMChannelInfo,
  true
> = {
  channelId: true,
  fromId: true,
  name: true,
  toId: true,
};
