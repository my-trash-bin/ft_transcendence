import { IntrospectAndCompose } from '@apollo/gateway';
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
            { name: 'main', url: env('SUBGRAPH_URL_MAIN') },
            { name: 'chat', url: env('SUBGRAPH_URL_CHAT') },
            { name: 'game', url: env('SUBGRAPH_URL_GAME') },
          ],
        }),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
