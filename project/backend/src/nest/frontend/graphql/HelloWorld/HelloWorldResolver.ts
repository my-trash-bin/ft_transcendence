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
import { PubSubService } from '../../../../main/base/PubSubService';
import { AuthorService } from '../../../application/AuthorService';
import { HelloWorldService } from '../../../application/HelloWorldService';
import { GraphqlAuthor } from '../Author/GraphqlAuthor';
import { GraphqlHelloWorld } from './GraphqlHelloWorld';

@Resolver((of: any) => GraphqlHelloWorld)
export class HelloWorldResolver {
  constructor(
    private readonly helloWorldService: HelloWorldService,
    private readonly authorService: AuthorService,
    private readonly pubSubService: PubSubService,
  ) {}

  @Query((returns) => GraphqlHelloWorld)
  async helloWorld(@Args('id', { type: () => ID }) id: string) {
    this.pubSubService.pub('helloworld', id);
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

  @Subscription((returns) => String, { resolve: I })
  commentAdded(): AsyncIterator<string> {
    const idIterator = this.pubSubService.sub('helloworld');
    return (async function* (): AsyncGenerator<string> {
      for await (const id of {
        [Symbol.asyncIterator]: () => idIterator,
      }) {
        yield `Hello world from ${id}!`;
      }
    })();
  }
}
