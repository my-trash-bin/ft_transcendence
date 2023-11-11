import { ChannelMember } from '@prisma/client';

export type PrismaChannelMember = Pick<
  ChannelMember,
  'channelId' | 'memberId' | 'memberType' | 'mutedUntil'
>;
