import { DIBaseException } from './DIBaseException';

export class InvalidOverrideException extends DIBaseException {
  constructor(name: string) {
    super(`Cannot register ${name} which is already registered`);
    this.name = 'InvalidOverrideException';
  }
}
