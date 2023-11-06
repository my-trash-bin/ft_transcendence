import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HelloWorld {
  @Field((type) => String)
  world!: string;
}
