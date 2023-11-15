import { DMChannelAssociation } from '@prisma/client';

export type PrismaDMChannelAssociation = Pick<
  DMChannelAssociation,
  'id' | 'member1Id' | 'member2Id'
>;
