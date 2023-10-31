import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { AuthorService } from '../../../application/AuthorService';
import { GraphqlHelloWorld } from '../HelloWorld/GraphqlHelloWorld';
import { GraphqlAuthor } from './GraphqlAuthor';

@Resolver((of: any) => GraphqlAuthor)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query((returns) => GraphqlHelloWorld)
  async author(@Args('id', { type: () => ID }) id: string) {
    return this.authorService.findOneById(id);
  }
}
