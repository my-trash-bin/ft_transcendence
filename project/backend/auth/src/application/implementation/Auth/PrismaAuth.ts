import { Auth } from '@prisma/client';

export type PrismaAuth = Pick<Auth, 'type' | 'id' | 'metadataJson' | 'userId'>;
