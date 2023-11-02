import { PubSub } from 'graphql-subscriptions';

import { IPubSubService } from '../interface/IPubSubService';

export class PubSubService implements IPubSubService {
  private readonly pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  async pub<T>(topic: string, value: T): Promise<void> {
    this.pubSub.publish(topic, value);
  }

  sub<T>(topic: string): AsyncIterator<T> {
    return this.pubSub.asyncIterator(topic);
  }
}
