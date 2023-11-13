import { Field, ID } from "type-graphql";

export class ChannelInvitationViewModel {
  @Field(() => ID, { nullable: false })
  channelId!: string;

  @Field(() => ID, { nullable: false })
  memberId!: string;

  @Field(() => Date, { nullable: false })
  invitedAt!: Date;

}
