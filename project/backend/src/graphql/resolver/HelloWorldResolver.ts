import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLHelloWorld } from '../type/GraphQLHelloWorld';
import { GraphQLAuthor } from '../type/GraphQLAuthor';
import { HelloWorldService } from '../../service/HelloWorldService';
import { AuthorService } from '../../service/AuthorService';

@Resolver((of: any) => GraphQLHelloWorld)
export class HelloWorldResolver {
  constructor(
    private readonly helloWorldService: HelloWorldService,
    private readonly authorService: AuthorService,
  ) {}

  @Query((returns) => GraphQLHelloWorld)
  async helloWorld(@Args('id', { type: () => ID }) id: string) {
    return this.helloWorldService.findOneById(id);
  }

  @ResolveField((of) => GraphQLAuthor)
  async author(@Parent() helloWorld: GraphQLHelloWorld) {
    const id = helloWorld.authorId;
    if (!id) return null;
    return this.authorService.findOneById(id);
  }
}
