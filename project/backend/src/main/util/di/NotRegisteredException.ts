import { DIBaseException } from './DIBaseException';

export class NotRegisteredException extends DIBaseException {
  constructor(name: string) {
    super(`Cannot resolve ${name} which is not registered`);
    this.name = 'NotRegisteredException';
  }
}
