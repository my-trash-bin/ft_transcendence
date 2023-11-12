import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/Upload.js';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';

import type { Context } from '../Context';
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
    @Arg('file', (type) => GraphQLUpload) file: FileUpload,
  ): Promise<number> {
    let size = 0;
    await new Promise((resolve) => {
      let readStream = file.createReadStream();
      readStream.on('data', (chunk) => {
        size += chunk.length;
      });
      readStream.on('end', resolve);
    });
    return size;
  }
}
