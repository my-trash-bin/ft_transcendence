
import { Field, ID } from "type-graphql";

export class ChannelMessageViewModel {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => ID, { nullable: false })
  channelId!: string;

  @Field(() => ID, { nullable: false })
  memberId!: string;

  @Field(() => Date, { nullable: false })
  sentAt!: Date;

  @Field(() => String, { nullable: false })
  messageJson!: string;

}
