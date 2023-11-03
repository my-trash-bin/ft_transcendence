import { createServer } from 'node:http';

import { ApolloServer, BaseContext, ContextFunction } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { buildSubgraphSchema } from '@apollo/subgraph';
import {
  printSchemaWithDirectives,
  type IResolvers,
} from '@graphql-tools/utils';
import cors from 'cors';
import express, { json } from 'express';
import gql from 'graphql-tag';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { SubscribeMessage } from 'graphql-ws';
import { Context } from 'graphql-ws/lib/server';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ExecutionArgs } from 'graphql/execution/execute';
import { GraphQLSchema } from 'graphql/type/schema';
import deepMerge from 'lodash.merge';
import {
  buildSchema,
  createResolversMap,
  type BuildSchemaOptions,
} from 'type-graphql';
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

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: IResolvers,
) {
  const schema = await buildSchema({
    ...options,
    skipCheck: true,
  });

  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSchemaWithDirectives(schema)),
    resolvers: deepMerge(createResolversMap(schema) as any, referenceResolvers),
  });

  return federatedSchema;
}
