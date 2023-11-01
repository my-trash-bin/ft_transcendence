import { InvalidIdException } from '../../../main/exception/InvalidIdException';

export function invalidId(id: string): InvalidIdException {
  return new InvalidIdException(id);
}
