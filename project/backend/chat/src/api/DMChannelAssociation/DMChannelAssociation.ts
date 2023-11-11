import { Field, ID, ObjectType } from 'type-graphql';
import { ChatUser } from '../ChatUser/ChatUser';
import { DMChannelInfo } from '../DMChannelInfo/DMChannelInfo';
import { DMMessage } from '../DMMessage/DMMessage';

@ObjectType()
export class DMChannelAssociation {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  member1Id!: string;

  @Field(() => ID)
  member2Id!: string;

  @Field(() => ChatUser)
  member1!: ChatUser;

  @Field(() => ChatUser)
  member2!: ChatUser;

  @Field(() => [DMChannelInfo])
  channelInfo!: DMChannelInfo[];

  @Field(() => [DMMessage])
  dmMessages!: DMMessage[];
}
