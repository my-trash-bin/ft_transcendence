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
import { GraphqlAuthor } from '../Author/GraphqlAuthor';
import { GraphqlHelloWorld } from './GraphqlHelloWorld';

@Resolver((of: any) => GraphqlHelloWorld)
export class HelloWorldResolver {
  constructor(
    private readonly helloWorldService: HelloWorldService,
    private readonly authorService: AuthorService,
  ) {}

  @Query((returns) => GraphqlHelloWorld)
  async helloWorld(@Args('id', { type: () => ID }) id: string) {
    return this.helloWorldService.findOneById(id);
  }

  @ResolveField((returns) => GraphqlAuthor, { nullable: true })
  async author(
    @Parent() helloWorld: GraphqlHelloWorld,
  ): Promise<GraphqlAuthor | null> {
    const id = helloWorld.authorId;
    if (!id) return null;
    return this.authorService.findOneById(id);
  }
}
