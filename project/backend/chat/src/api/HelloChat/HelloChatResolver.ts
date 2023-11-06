import { Query, Resolver } from 'type-graphql';

import { HelloChat } from './HelloChat';

@Resolver((of) => HelloChat)
export class HelloChatResolver {
  @Query((returns) => HelloChat)
  async helloChat(): Promise<HelloChat> {
    return { chat: 'Hello chat!' };
  }
}
