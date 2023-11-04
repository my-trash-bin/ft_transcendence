import { idOf } from '../../../util/id/idOf';
import { DBConsistencyException } from '../../exception/DBConsistencyException';
import { AuthView } from '../../interface/Auth/view/AuthView';
import { PrismaAuth } from './PrismaAuth';

export function mapPrismaAuthToAuthView({
  type,
  id,
  metadataJson,
  userId,
}: PrismaAuth): AuthView {
  switch (type) {
    case 'FT':
      return {
        type: 'FT',
        id: idOf(id),
        metadata: JSON.parse(metadataJson),
        userId: idOf(userId),
      };
    default:
      throw new DBConsistencyException(`Unknown AuthType: ${type}`);
  }
}
