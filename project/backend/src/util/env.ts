export class MissingEnvError extends Error {
  constructor(key: string) {
    super(`Missing environment variable: ${key}`);
    this.name = 'MissingEnvError';
  }
}

export function env(key: string): string {
  const result = process.env[key];
  if (result === undefined) {
    throw new MissingEnvError(key);
  }
  return result;
}
