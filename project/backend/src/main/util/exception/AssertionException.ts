export class AssertionException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AssertionException';
  }
}
