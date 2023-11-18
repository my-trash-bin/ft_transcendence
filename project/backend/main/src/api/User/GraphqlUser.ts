import { Directive, Field, ID, ObjectType } from 'type-graphql';

@ObjectType('User')
@Directive('@extends')
@Directive('@key(fields: id)')
export class GraphqlUser {
  @Field((type) => ID)
  @Directive('@external')
  id!: string;

  @Field((type) => String)
  nickname!: string;

  @Field((type) => String, { nullable: true })
  profileImageUrl?: string;
}
