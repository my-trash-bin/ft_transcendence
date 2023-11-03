import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { env } from '@ft_transcendence/common/env';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: env('SUBGRAPH_URL_AUTH') },
            { name: 'main', url: env('SUBGRAPH_URL_MAIN') },
            { name: 'chat', url: env('SUBGRAPH_URL_CHAT') },
            { name: 'pong', url: env('SUBGRAPH_URL_PONG') },
          ],
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
