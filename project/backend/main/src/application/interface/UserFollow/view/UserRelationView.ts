import { UserView } from "../../User/view/UserView";

export interface UserRelationView extends UserView {
  followOrBlockedAt: Date
}
