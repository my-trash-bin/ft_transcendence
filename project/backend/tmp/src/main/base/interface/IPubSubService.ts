export interface IPubSubService {
  pub<T>(topic: string, value: T): Promise<void>;
  sub<T>(topic: string): AsyncIterator<T>;
}
