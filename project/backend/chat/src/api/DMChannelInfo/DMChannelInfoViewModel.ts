import { Field, ID } from 'type-graphql';

export class DMChannelInfoViewModel {
  @Field(() => ID, { nullable: false })
  fromId!: string;

  @Field(() => ID, { nullable: false })
  toId!: string;

  @Field(() => ID, { nullable: false })
  channelId!: string;

  @Field(() => String, { nullable: false })
  name!: string;
}
