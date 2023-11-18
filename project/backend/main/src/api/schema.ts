import { buildFederatedSchema } from '@ft_transcendence/sub/api';
import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';

import { Context } from './Context';
import { HelloWorldResolver } from './HelloWorld/HelloWorldResolver';
import { isTypegraphqlError } from './isTypegraphqlError';
import { UserResolver } from './User/UserResolver';

const errorInterceptor: MiddlewareFn<Context> = async ({ context }, next) => {
  try {
    return await next();
  } catch (err) {
    if (isTypegraphqlError(err)) throw err;

    console.log(err);
    if (!(err instanceof Error)) throw err;
    throw new GraphQLError(err.message, {
      extensions: {
        code: err.name,
      },
    });
  }
};

export const schema = buildFederatedSchema({
  globalMiddlewares: [errorInterceptor],
  resolvers: [HelloWorldResolver, UserResolver],
  validate: true,
});
