import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HelloAuth {
  @Field((type) => String)
  auth!: string;
}
