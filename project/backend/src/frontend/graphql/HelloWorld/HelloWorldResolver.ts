import { I } from '@-ft/i';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { AuthorService } from '../../../application/AuthorService';
import { HelloWorldService } from '../../../application/HelloWorldService';
import { PubSubService } from '../../../base/PubSubService';
import { GraphQLAuthor } from '../Author/GraphQLAuthor';
import { GraphQLHelloWorld } from './GraphQLHelloWorld';

@Resolver((of: any) => GraphQLHelloWorld)
export class HelloWorldResolver {
  constructor(
    private readonly helloWorldService: HelloWorldService,
    private readonly authorService: AuthorService,
    private readonly pubSubService: PubSubService,
  ) {}

  @Query((returns) => GraphQLHelloWorld)
  async helloWorld(@Args('id', { type: () => ID }) id: string) {
    this.pubSubService.pub('helloworld', id);
    return this.helloWorldService.findOneById(id);
  }

  @ResolveField((returns) => GraphQLAuthor, { nullable: true })
  async author(
    @Parent() helloWorld: GraphQLHelloWorld,
  ): Promise<GraphQLAuthor | null> {
    const id = helloWorld.authorId;
    if (!id) return null;
    return this.authorService.findOneById(id);
  }

  @Subscription((returns) => String, { resolve: I })
  commentAdded(): AsyncIterator<string> {
    const idIterator = this.pubSubService.sub('helloworld');
    const sub = {
      [Symbol.asyncIterator]: () => idIterator,
    };
    return (async function* (): AsyncGenerator<string> {
      for await (const id of sub) {
        yield `Hello world from ${id}!`;
      }
    })();
  }
}
