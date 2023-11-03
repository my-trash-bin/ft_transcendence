import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HelloChat {
  @Field((type) => String)
  chat!: string;
}
