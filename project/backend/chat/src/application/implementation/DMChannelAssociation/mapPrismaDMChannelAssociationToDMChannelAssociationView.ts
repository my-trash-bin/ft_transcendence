import { idOf } from "../../../util/id/idOf";
import { DMChannelAssociationView } from "../../interface/DMChannelAssociation/view/DMChannelAssociationView";
import { PrismaDMChannelAssociation } from "./PrismaDMChannelAssociation";

export function mapPrismaDMChannelAssociationToDMChannelAssociationView({
  id,
  member1Id,
  member2Id,
}: PrismaDMChannelAssociation): DMChannelAssociationView {
  return {
    id: idOf(id),
    member1Id: idOf(member1Id),
    member2Id: idOf(member2Id)
  }
}