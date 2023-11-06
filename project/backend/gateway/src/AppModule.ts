import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { env } from '@ft_transcendence/common/env';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { sign } from 'jsonwebtoken';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: ({ name, url }) => {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set(
                'Authorization',
                `Bearer ${context.token}`,
              );
            },
          });
        },
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: env('SUBGRAPH_URL_AUTH') },
            { name: 'main', url: env('SUBGRAPH_URL_MAIN') },
            { name: 'chat', url: env('SUBGRAPH_URL_CHAT') },
            { name: 'pong', url: env('SUBGRAPH_URL_PONG') },
          ],
          introspectionHeaders: () => ({
            Authorization: `Bearer ${sign(
              { user: { system: true } },
              env('JWT_SECRET'),
              { expiresIn: '1d' },
            )}`,
          }),
        }),
      },

      server: {
        playground: false,
        ...(process.env.NODE_ENV === 'development' && {
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
