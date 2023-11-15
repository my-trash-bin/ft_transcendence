import { Field, ID } from 'type-graphql';

export class ChatUserViewModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  authUserId!: string;
}
