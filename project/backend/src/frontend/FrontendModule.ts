import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/GraphqlModule';
import { V1Module } from './v1/V1Module';

@Module({
  imports: [V1Module, GraphqlModule],
})
export class FrontendModule {}
