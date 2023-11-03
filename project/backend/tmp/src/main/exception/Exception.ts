export class Exception extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}
