import { InvalidIdException } from '../application/exception/InvalidIdException';

export function invalidId(id: string): InvalidIdException {
  return new InvalidIdException(id);
}
