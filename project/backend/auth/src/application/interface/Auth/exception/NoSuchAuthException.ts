import { AuthType } from '@prisma/client';
import { Exception } from '../../../exception/Exception';

export class NoSuchAuthException extends Exception {
  constructor(type: AuthType, id: string);
  constructor(id: string);
  constructor(typeOrId: AuthType | string, id?: string) {
    if (id === undefined)
      super('NoSuchAuthException', `Given id ${typeOrId} does not exist`);
    else
      super(
        'NoSuchAuthException',
        `Given type/id ${typeOrId}/${id} does not exist`,
      );
  }
}
