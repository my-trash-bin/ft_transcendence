import { InvalidIdException } from './InvalidIdException';

export function invalidId(id: string): InvalidIdException {
  return new InvalidIdException(id);
}
