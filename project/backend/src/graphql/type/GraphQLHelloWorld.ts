import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('HelloWorld')
export class GraphQLHelloWorld {
  @Field((type) => ID)
  id!: string;

  @Field({ nullable: true })
  message?: string;

  authorId?: string;
}
