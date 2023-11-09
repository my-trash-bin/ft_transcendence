import { ChatUserId } from "../../ChatUser/view/ChatUserView";
import { Id } from "../../Id";

export type DMChannelAssociationId = Id<'dMChannelAssociation'>;

export interface DMChannelAssociationView {
  id:         DMChannelAssociationId;
  member1Id:  ChatUserId;
  member2Id:  ChatUserId;
}
