export interface Id<T extends string> {
  ' No value here, Just for type check.': T;
  value: string;
}

export function idOf<T extends string>(id: string): Id<T> {
  return { value: id } as Id<T>;
}

export type UserId = Id<'user'>;
