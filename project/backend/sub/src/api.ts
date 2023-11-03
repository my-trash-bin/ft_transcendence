import { createServer } from 'node:http';

import { ApolloServer, BaseContext, ContextFunction } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import cors from 'cors';
import express, { json } from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { SubscribeMessage } from 'graphql-ws';
import { Context } from 'graphql-ws/lib/server';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ExecutionArgs } from 'graphql/execution/execute';
import { GraphQLSchema } from 'graphql/type/schema';
import { WebSocketServer } from 'ws';

export async function start<TContext extends BaseContext>(
  port: number,
  schema: GraphQLSchema,
  wsContext?: (
    ctx: Context,
    message: SubscribeMessage,
    args: ExecutionArgs,
  ) => Promise<TContext>,
  httpContext?: ContextFunction<[ExpressContextFunctionArgument], TContext>,
) {
  const app = express();
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });

  const wsServerCleanup = useServer({ schema, context: wsContext }, wsServer);

  const dev = process.env.NODE_ENV === 'development';

  const server = new ApolloServer({
    schema,
    introspection: dev,
    includeStacktraceInErrorResponses: dev,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
      dev
        ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
        : ApolloServerPluginLandingPageDisabled(),
    ],
  });
  await server.start();

  app.use(
    '/graphql',
    cors(),
    json(),
    graphqlUploadExpress(),
    expressMiddleware(server, { context: httpContext }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen(port, () => resolve()),
  );
  return async () => {
    await Promise.all([httpServer.close(), server.stop()]);
  };
}
