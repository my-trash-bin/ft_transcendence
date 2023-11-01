import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType('IException')
export abstract class GraphqlIException {
  @Field((type) => String)
  message!: string;

  @Field((type) => String)
  logId!: string;
}
