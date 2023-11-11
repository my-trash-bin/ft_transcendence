import { Field, ID } from "type-graphql";

export class ChannelViewModel {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  isPublic!: boolean;

  @Field({ nullable: true })
  password?: string;

  @Field()
  createdAt!: Date;

  @Field()
  lastActiveAt!: Date;

  @Field(() => ID, { nullable: true })
  ownerId?: string;

  @Field()
  memberCount!: number;

  @Field()
  maximumMemberCount!: number;
}
