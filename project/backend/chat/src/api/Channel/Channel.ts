import { Field, ID, Int, ObjectType } from 'type-graphql';
import { ChannelInvitation } from '../ChannelInvitation/ChannelInvitation';
import { ChannelMember } from '../ChannelMember/ChannelMember';
import { ChannelMessage } from '../ChannelMessage/ChannelMessage';
import { ChatUser } from '../ChatUser/ChatUser';

// @InputType: GraphQL 입력 타입 정의. 뮤테이션에서 복잡한 인자 받을때 사용
// @ArgsType: 여러 필드를 가진 인자를 하나의 객체로 묶어 처리하는데 사용.
// @Resolver()

@ObjectType() // GraphQL 객체 타입으로 정의
export class Channel {
  @Field(() => ID) // GraphQL에 속성 노출 & 인자: optional 반환 타입 명시
  id!: string;

  @Field()
  title!: string;

  @Field()
  isPublic!: boolean;

  @Field({ nullable: true })
  password?: string;

  @Field()
  createdAt!: Date;

  @Field()
  lastActiveAt!: Date;

  @Field({ nullable: true })
  ownerId?: string;

  @Field(() => Int)
  memberCount!: number;

  @Field(() => Int)
  maximumMemberCount!: number;

  @Field(() => ChatUser, { nullable: true })
  owner?: ChatUser;

  @Field(() => [ChannelMember])
  members!: ChannelMember[];

  @Field(() => [ChannelMessage])
  messages!: ChannelMessage[];

  @Field(() => [ChannelInvitation])
  channelInvitations!: ChannelInvitation[];
}
