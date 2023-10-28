import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorService } from '../../../application/AuthorService';
import { HelloWorldService } from '../../../application/HelloWorldService';
import { GraphQLAuthor } from '../Author/GraphQLAuthor';
import { GraphQLHelloWorld } from './GraphQLHelloWorld';

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

  @ResolveField((of) => GraphQLAuthor, { nullable: true })
  async author(
    @Parent() helloWorld: GraphQLHelloWorld,
  ): Promise<GraphQLAuthor | null> {
    const id = helloWorld.authorId;
    if (!id) return null;
    return this.authorService.findOneById(id);
  }
}
