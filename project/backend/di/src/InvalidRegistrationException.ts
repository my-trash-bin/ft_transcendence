import { DIBaseException } from './DIBaseException';

export class InvalidRegistrationException extends DIBaseException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRegistrationException';
  }
}
