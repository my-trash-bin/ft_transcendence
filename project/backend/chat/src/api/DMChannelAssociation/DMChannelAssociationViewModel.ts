import { Field, ID } from 'type-graphql';

export class DMChannelAssociationViewModel {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => ID, { nullable: false })
  member1Id!: string;

  @Field(() => ID, { nullable: false })
  member2Id!: string;
}
