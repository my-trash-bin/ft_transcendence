import { Field, ID, ObjectType } from 'type-graphql';
import { Channel } from '../Channel/Channel';
import { ChatUser } from '../ChatUser/ChatUser';

@ObjectType()
export class ChannelInvitation {
  @Field(() => ID)
  channelId!: string;

  @Field(() => ID)
  memberId!: string;

  @Field()
  invitedAt!: Date;

  @Field(() => Channel)
  channel!: Channel;

  @Field(() => ChatUser)
  member!: ChatUser;
}
