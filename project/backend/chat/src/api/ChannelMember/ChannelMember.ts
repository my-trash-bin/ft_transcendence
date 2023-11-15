import { ChannelMemberType } from '../ChannelMemberType/ChannelMemberType';

import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { Channel } from '../Channel/Channel';
import { ChatUser } from '../ChatUser/ChatUser';

registerEnumType(ChannelMemberType, {
  name: 'ChannelMemberType', // this one is mandatory
  description: 'The basic roles of a channel member', // this one is optional
});

@ObjectType()
export class ChannelMember {
  @Field(() => ID)
  channelId!: string;

  @Field(() => ID)
  memberId!: string;

  @Field(() => ChannelMemberType)
  memberType!: ChannelMemberType;

  @Field()
  mutedUntil!: Date;

  @Field(() => Channel)
  channel!: Channel;

  @Field(() => ChatUser)
  member!: ChatUser;
}
