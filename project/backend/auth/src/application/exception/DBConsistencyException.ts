import { Exception } from './Exception';

export class DBConsistencyException extends Exception {
  constructor(reason: string) {
    super('DBConsistencyException', `DB Consistency broken: ${reason}`);
  }
}
