import { InvalidIdException } from '../../exception/InvalidIdException';

export function invalidId(id: string): InvalidIdException {
  return new InvalidIdException(id);
}
