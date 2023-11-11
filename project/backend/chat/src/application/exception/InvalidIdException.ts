import { Id } from '../interface/Id';
import { Exception } from './Exception';

export class InvalidIdException extends Exception {
  constructor(id: Id<any> | string) {
    super('InvalidIdException', `Given id ${typeof id === 'string' ? id : id.value} does not exist`);
  }
}
