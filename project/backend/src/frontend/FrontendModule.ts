import { Module } from '@nestjs/common';
import { GraphQLModule } from './graphql/GraphQLModule';
import { V1Module } from './v1/V1Module';

@Module({
  imports: [V1Module, GraphQLModule],
})
export class FrontendModule {}
