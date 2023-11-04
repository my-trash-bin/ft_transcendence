import { AuthType } from '@prisma/client';
import { Exception } from '../../../exception/Exception';

export class NoSuchAuthException extends Exception {
  constructor(type: AuthType, id: string) {
    super('NoSuchAuthException', `Given type/id ${type}/${id} does not exist`);
  }
}
