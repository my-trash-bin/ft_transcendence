import { Exception } from './Exception';

export class InvalidAccessException extends Exception {
  constructor() {
    super('InvalidAccessException', 'No access');
  }
}
