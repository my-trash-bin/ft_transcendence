import { Field, ID, ObjectType } from 'type-graphql';
import { ChatUser } from '../ChatUser/ChatUser';
import { DMChannelAssociation } from '../DMChannelAssociation/DMChannelAssociation';


@ObjectType()
export class DMChannelInfo {
  @Field(() => ID)
  fromId!: string;

  @Field(() => ID)
  toId!: string;

  @Field(() => ID)
  channelId!: string;

  @Field()
  name!: string;

  @Field(() => ChatUser)
  from!: ChatUser;

  @Field(() => ChatUser)
  to!: ChatUser;

  @Field(() => DMChannelAssociation)
  channel!: DMChannelAssociation;
}
