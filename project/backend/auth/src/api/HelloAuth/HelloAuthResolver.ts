import { Query, Resolver } from 'type-graphql';

import { HelloAuth } from './HelloAuth';

@Resolver((of) => HelloAuth)
export class HelloAuthResolver {
  @Query((returns) => HelloAuth)
  async helloAuth(): Promise<HelloAuth> {
    return { auth: 'Hello auth!' };
  }
}
