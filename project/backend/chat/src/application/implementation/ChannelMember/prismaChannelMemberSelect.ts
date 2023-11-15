import { PrismaChannelMember } from './PrismaChannelMember';

export const prismaChannelMemberSelect: Record<
  keyof PrismaChannelMember,
  true
> = {
  channelId: true,
  memberId: true,
  memberType: true,
  mutedUntil: true,
};
