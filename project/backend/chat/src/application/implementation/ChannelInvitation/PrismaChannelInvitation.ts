import { ChannelInvitation } from '@prisma/client';

export type PrismaChannelInvitation = Pick<
  ChannelInvitation,
  'channelId' | 'invitedAt' | 'memberId'
>;
