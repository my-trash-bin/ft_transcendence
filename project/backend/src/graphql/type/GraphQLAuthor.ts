import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GraphQLAuthor {
  @Field((type) => ID)
  id!: string;

  @Field()
  name!: string;
}
