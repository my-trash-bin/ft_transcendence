import { MainUser } from "@prisma/client";
import { UserId } from "../User/view/UserView";
import { UserRelationView } from "./view/UserRelationView";

export interface IUserFollowService {
  // Create & Update
  followUser(followeeId: UserId): Promise<void>;
  blockUser(followeeId: UserId): Promise<void>;

  // Read
  isFollowing(followeeId: UserId): Promise<boolean>;
  isBlocked(followeeId: UserId): Promise<boolean>;

  // Delete
  unfollowUser(followeeId: UserId): Promise<void>;
  unblockUser(followeeId: UserId): Promise<void>;

  getFollowers(): Promise<UserRelationView[]>;
  getFollowing(): Promise<MainUser[]>;
  getBlockedUsers(): Promise<MainUser[]>
}
