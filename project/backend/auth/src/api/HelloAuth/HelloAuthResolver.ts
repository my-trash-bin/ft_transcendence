import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';

import type { Context } from '../Context';
import { FederatedFileUpload } from '../FederatedFileUpload';
import { HelloAuth } from './HelloAuth';

@Resolver((of) => HelloAuth)
export class HelloAuthResolver {
  @Query((returns) => HelloAuth)
  async helloAuth(@Ctx() ctx: Context): Promise<HelloAuth> {
    return {
      auth: `Hello ${JSON.stringify(ctx.container.resolve('requestContext'))}!`,
    };
  }

  @Mutation((type) => Int)
  async helloFile(
    @Arg('file', (type) => GraphQLUpload, { validate: false })
    file: FederatedFileUpload,
  ): Promise<number> {
    console.log(file);
    return 0;
  }
}
