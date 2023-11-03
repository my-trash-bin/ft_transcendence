import { Query, Resolver } from 'type-graphql';

import { HelloGame } from './HelloGame';

@Resolver((of) => HelloGame)
export class HelloGameResolver {
  @Query((returns) => HelloGame)
  async helloGame(): Promise<HelloGame> {
    return { game: 'Hello game!' };
  }
}
