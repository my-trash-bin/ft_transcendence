import { Exception } from './Exception';

export class InvalidAccessException extends Exception {
  constructor() {
    super('InvalidIdException', "No access");
  }
}
