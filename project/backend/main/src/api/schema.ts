import { GraphQLError } from 'graphql';
import { buildSchema, MiddlewareFn } from 'type-graphql';
import { Context } from './Context';
import { HelloWorldResolver } from './HelloWorld/HelloWorldResolver';
import { isTypegraphqlError } from './isTypegraphqlError';

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

export const schema = buildSchema({
  globalMiddlewares: [errorInterceptor],
  resolvers: [HelloWorldResolver],
  validate: true,
});
