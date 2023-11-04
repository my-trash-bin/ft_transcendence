import { User } from '@prisma/client';

export type PrismaUser = Pick<User, 'id' | 'joinedAt' | 'leavedAt'>;
