export interface Id<T extends string> {
  ' No value here, Just for type check.': T;
  value: string;
}

export function idOf<T extends string>(id: string): Id<T> {
  return { value: id } as Id<T>;
}

export type UserId = Id<'user'>;
export type AuthId = Id<'auth'>;
export type ChannelId = Id<'channel'>;
export type DmChannelId = Id<'dmChannel'>;
export type ClientId = Id<'client'>;
export type GameHistoryId = Id<'gameHistory'>;
