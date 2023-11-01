import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Middleware } from '../Middleware';
import { GraphqlModule } from './graphql/GraphqlModule';
import { V1Module } from './v1/V1Module';

@Module({
  imports: [V1Module, GraphqlModule],
})
export class FrontendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('*');
  }
}
