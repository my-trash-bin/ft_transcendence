import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class GraphqlUser {
  @Field((type) => ID)
  id!: string;

  @Field((returns) => String)
  nickname!: string;

  @Field((returns) => String, { nullable: true })
  profileImageUrl?: string;

  @Field((returns) => Date)
  joinedAt!: Date;

  @Field((returns) => Date, { nullable: true })
  leavedAt?: Date;
}
