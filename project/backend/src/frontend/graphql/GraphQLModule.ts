import { join } from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { AuthorModule } from './Author/AuthorModule';
import { HelloWorldModule } from './HelloWorld/HelloWorldModule';
import { UserModule } from './User/UserModule';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
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

    UserModule,
  ],
})
export class GraphqlModule {}
