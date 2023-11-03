import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HelloGame {
  @Field((type) => String)
  game!: string;
}
