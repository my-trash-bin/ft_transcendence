import { Field, ID, ObjectType } from 'type-graphql';
import { ChatUser } from '../ChatUser/ChatUser';
import { DMChannelAssociation } from '../DMChannelAssociation/DMChannelAssociation';

@ObjectType()
export class DMMessage {
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

  @Field(() => DMChannelAssociation)
  channel!: DMChannelAssociation;

  @Field(() => ChatUser)
  member!: ChatUser;
}
