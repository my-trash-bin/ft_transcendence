import { ChannelMemberType } from '@prisma/client';
import { Field, ID } from "type-graphql";

export class ChannelMemberViewModel {
  @Field(() => ID, { nullable: false })
  channelId!: string;

  @Field(() => ID, { nullable: false })
  memberId!: string;

  @Field(() => ChannelMemberType, { nullable: false })
  memberType!: ChannelMemberType;

  @Field(() => Date, { nullable: false })
  mutedUntil!: Date;

}
