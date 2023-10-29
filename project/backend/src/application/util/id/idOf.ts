import { Id } from './Id';

export function idOf<T extends string>(id: string): Id<T> {
  return { value: id } as Id<T>;
}
