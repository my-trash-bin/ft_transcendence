import { Exception } from './Exception';

export class InvalidIdException extends Exception {
  constructor(id: string) {
    super('InvalidIdException', `Given id ${id} does not exist`);
  }
}
