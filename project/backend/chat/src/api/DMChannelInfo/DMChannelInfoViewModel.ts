import { ChatUserId } from "../../ChatUser/view/ChatUserView";
import { DMChannelAssociationId } from "../../DMChannelAssociation/view/DMChannelAssociationView";
import { Id } from "../../Id";

import { Field, ID } from "type-graphql";

export class DMChannelInfoViewModel {
  @Field(() => ID, { nullable: false })
  fromId!: ChatUserId;

  @Field(() => ID, { nullable: false })
  toId!: ChatUserId;

  @Field(() => ID, { nullable: false })
  channelId!: DMChannelAssociationId;

  @Field(() => string, { nullable: false })
  name!: string;

}
