import { Field, ID, ObjectType } from 'type-graphql';
import { Channel } from '../Channel/Channel';
import { ChannelInvitation } from '../ChannelInvitation/ChannelInvitation';
import { ChannelMember } from '../ChannelMember/ChannelMember';
import { ChannelMessage } from '../ChannelMessage/ChannelMessage';
import { DMChannelAssociation } from '../DMChannelAssociation/DMChannelAssociation';
import { DMChannelInfo } from '../DMChannelInfo/DMChannelInfo';
import { DMMessage } from '../DMMessage/DMMessage';

@ObjectType()
export class ChatUser {
  @Field(() => ID)
  id!: string;

  @Field()
  authUserId!: string;

  @Field(() => [Channel])
  ownedChannels!: Channel[];

  @Field(() => [ChannelMember])
  channels!: ChannelMember[];

  @Field(() => [ChannelMessage])
  messages!: ChannelMessage[];

  @Field(() => [ChannelInvitation])
  channelInvitations!: ChannelInvitation[];

  @Field(() => [DMChannelAssociation])
  dmChannel1!: DMChannelAssociation[];

  @Field(() => [DMChannelAssociation])
  dmChannel2!: DMChannelAssociation[];

  @Field(() => [DMChannelInfo])
  dmChannelInfoFrom!: DMChannelInfo[];

  @Field(() => [DMChannelInfo])
  dmChannelInfoTo!: DMChannelInfo[];

  @Field(() => [DMMessage])
  dmMessage!: DMMessage[];
}
