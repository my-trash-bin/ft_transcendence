import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
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
