import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { GraphQLHelloWorld } from '../type/GraphQLHelloWorld';
import { GraphQLAuthor } from '../type/GraphQLAuthor';
import { AuthorService } from '../../service/AuthorService';

@Resolver((of: any) => GraphQLAuthor)
export class HelloWorldResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query((returns) => GraphQLHelloWorld)
  async author(@Args('id', { type: () => ID }) id: string) {
    return this.authorService.findOneById(id);
  }
}
