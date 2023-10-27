import { Module } from '@nestjs/common';
import { GraphQLModule } from './graphql/graphql.module';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [V1Module, GraphQLModule],
})
export class FrontendModule {}
