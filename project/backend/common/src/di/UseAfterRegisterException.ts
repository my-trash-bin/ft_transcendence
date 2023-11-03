import { DIBaseException } from './DIBaseException';

export class UseAfterRegisterException extends DIBaseException {
  constructor() {
    super('Cannot use removed container (removed by register)');
    this.name = 'UseAfterRegisterException';
  }
}
