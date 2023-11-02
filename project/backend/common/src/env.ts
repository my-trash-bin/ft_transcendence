export function env(name: string): string {
  const result = process.env[name];
  if (result === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return result;
}
