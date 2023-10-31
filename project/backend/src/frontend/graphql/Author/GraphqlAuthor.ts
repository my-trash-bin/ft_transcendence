import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Author')
export class GraphqlAuthor {
  @Field((type) => ID)
  id!: string;

  @Field((type) => String)
  name!: string;
}
