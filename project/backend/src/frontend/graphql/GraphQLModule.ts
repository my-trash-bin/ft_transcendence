import { join } from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { AuthorModule } from './Author/AuthorModule';
import { HelloWorldModule } from './HelloWorld/HelloWorldModule';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      subscriptions: {
        'subscriptions-transport-ws': { keepAlive: 3600 },
      },
      playground: false,

      ...(process.env.NODE_ENV === 'production'
        ? {
            debug: false,
          }
        : {
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
          }),
    }),

    AuthorModule,
    HelloWorldModule,
  ],
})
export class GraphQLModule {}
