import { InvalidIdException } from "../../exception/InvalidIdException";
import { ChatUserId } from "../ChatUser/view/ChatUserView";
import { DMChannelAssociationId, DMChannelAssociationView } from "./view/DMChannelAssociationView";

export interface IDMChannelAssociationService {
  getMany(
    ids: ChatUserId[]
  ): Promise<(DMChannelAssociationView | InvalidIdException)[]>;
  findOrCreate(
    member1Id: ChatUserId,
    member2Id: ChatUserId,
  ): Promise<DMChannelAssociationView>;
  deleteByMemberId(
    member1Id: ChatUserId,
    member2Id: ChatUserId
  ):Promise<DMChannelAssociationView>;
  deleteByDMChannelAssociationId(
    id: DMChannelAssociationId
  ):Promise<DMChannelAssociationView>;
}
