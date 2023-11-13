import { ChatUserId } from "../../ChatUser/view/ChatUserView";
import { Id } from "../../Id";

import { Field, ID } from "type-graphql";

export class DMChannelAssociationViewModel {
  @Field(() => ID, { nullable: false })
  id!: DMChannelAssociationId;

  @Field(() => ID, { nullable: false })
  member1Id!: ChatUserId;

  @Field(() => ID, { nullable: false })
  member2Id!: ChatUserId;

}
