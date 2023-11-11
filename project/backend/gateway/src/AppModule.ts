import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { env } from '@ft_transcendence/common/env';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import FileUploadDataSource from '@profusion/apollo-federation-upload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { expressjwt } from 'express-jwt';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: ({ name, url }) => {
          return new FileUploadDataSource({
            url,
            willSendRequest({ request, context }: any) {
              if (!request.http) {
                request.http = {
                  headers: Object.entries({
                    ...(context.user && { user: JSON.stringify(context.user) }),
                    'apollo-require-preflight': 'Hello world!',
                  }),
                };
              } else {
                if (context.user)
                  request.http.headers.append(
                    'user',
                    JSON.stringify(context.user),
                  );
              }
            },
          });
        },
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: env('SUBGRAPH_URL_AUTH') },
            // { name: 'main', url: env('SUBGRAPH_URL_MAIN') },
            // { name: 'chat', url: env('SUBGRAPH_URL_CHAT') },
            // { name: 'pong', url: env('SUBGRAPH_URL_PONG') },
          ],
        }),
      },

      server: {
        playground: false,
        ...(process.env.NODE_ENV === 'development' && {
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
        context: ({ req }: { req: any }) => {
          const user = req.auth?.user || null;
          return { user };
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors(),
        cookieParser(env('COOKIE_SECRET')),
        expressjwt({
          secret: env('JWT_SECRET'),
          algorithms: ['HS256'],
          credentialsRequired: false,
          getToken: (req) => req.cookies?.jwt,
        }),
        graphqlUploadExpress(),
      )
      .forRoutes('/graphql');
  }
}
