import { PrismaAuth } from './PrismaAuth';

export const prismaAuthSelect: Record<keyof PrismaAuth, true> = {
  type: true,
  id: true,
  metadataJson: true,
  userId: true,
};
