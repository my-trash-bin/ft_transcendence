import { Field, ID, ObjectType } from 'type-graphql';
import { Channel } from '../Channel/Channel';
import { ChatUser } from '../ChatUser/ChatUser';

@ObjectType()
export class ChannelMessage {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  channelId!: string;

  @Field(() => ID)
  memberId!: string;

  @Field()
  sentAt!: Date;

  @Field()
  messageJson!: string;

  // 관계 필드
  @Field(() => Channel)
  channel!: Channel;

  @Field(() => ChatUser)
  member!: ChatUser;
}
