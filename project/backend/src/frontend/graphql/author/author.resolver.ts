import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { AuthorService } from '../../../application/AuthorService';
import { GraphQLHelloWorld } from '../helloworld/helloworld.type';
import { GraphQLAuthor } from './author.type';

@Resolver((of: any) => GraphQLAuthor)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query((returns) => GraphQLHelloWorld)
  async author(@Args('id', { type: () => ID }) id: string) {
    return this.authorService.findOneById(id);
  }
}
