import { join } from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      subscriptions: {
        'subscriptions-transport-ws': { keepAlive: 3600 },
      },
      include: [],

      ...(process.env.NODE_ENV === 'production'
        ? {
            debug: false,
            playground: false,
          }
        : {
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
          }),
    }),
  ],
})
export class GraphQLModule {}
