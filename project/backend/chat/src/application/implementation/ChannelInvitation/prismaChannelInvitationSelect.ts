import { PrismaChannelInvitation } from './PrismaChannelInvitation';

export const prismaChannelInvitationSelect: Record<
  keyof PrismaChannelInvitation,
  true
> = {
  channelId: true,
  memberId: true,
  invitedAt: true,
};
