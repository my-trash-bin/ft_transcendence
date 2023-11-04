import { Query, Resolver } from 'type-graphql';

import { HelloWorld } from './HelloWorld';

@Resolver((of) => HelloWorld)
export class HelloWorldResolver {
  @Query((returns) => HelloWorld)
  async helloWorld(): Promise<HelloWorld> {
    return { world: 'Hello world!' };
  }
}
