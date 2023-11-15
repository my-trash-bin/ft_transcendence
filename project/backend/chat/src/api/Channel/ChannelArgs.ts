import { IsUUID, Length, Max, Min } from 'class-validator';
import { ArgsType, Field, ID } from 'type-graphql';
import { Channel } from './Channel';

@ArgsType()
export class ChannelCreateArgs implements Partial<Channel> {
  @Field()
  @Length(6, 20)
  title!: string;

  @Field()
  isPublic!: boolean;

  @Field(() => String, { nullable: true })
  password!: string;

  @Field()
  @Min(1)
  @Max(20)
  maximumMemberCount!: number;
}

@ArgsType()
export class ChannelUpdateArgs implements Partial<Channel> {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  title?: string;

  @Field()
  isPublic?: boolean;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field()
  @Min(1)
  @Max(20)
  maximumMemberCount?: number;
}

@ArgsType()
export class ChannelUpdateStateArgs implements Partial<Channel> {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => String, { nullable: true })
  ownerId?: string;

  @Field()
  @Min(0)
  @Max(20)
  memberCount?: number;
}
