import { DIBaseException } from './DIBaseException';

export class InvalidDependencyException extends DIBaseException {
  constructor(name: string) {
    super(`Cannot resolve ${name} as dependency of longer-life element`);
    this.name = 'InvalidDependencyException';
  }
}
