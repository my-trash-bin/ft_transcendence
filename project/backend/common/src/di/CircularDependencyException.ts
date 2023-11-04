import { DIBaseException } from './DIBaseException';

export class CircularDependencyException extends DIBaseException {
  constructor(name: string) {
    super(`Cannot resolve ${name} which has circular dependency`);
    this.name = 'CircularDependencyException';
  }
}
