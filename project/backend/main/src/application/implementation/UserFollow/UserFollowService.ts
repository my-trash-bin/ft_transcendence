import { Resolver } from '@ft_transcendence/common/di/Container';
import { MainUser } from '@prisma/client';
import { idOf } from '../../../util/id/idOf';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext, RequestContextUser } from '../../RequestContext';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IRepository } from '../../interface/IRepository';
import { UserId } from '../../interface/User/view/UserView';
import { IUserFollowService } from '../../interface/UserFollow/IUserFollowService';
import { UserRelationView } from '../../interface/UserFollow/view/UserRelationView';
import { mapPrismaUserFollowWithFolloweeToUserRelationView } from './mapPrismaUserFollowWithFolloweeToUserRelationView';
import { prismaUserFollowWithFolloweeSelect } from './prismaUserFollowFolloweeSelect';

export class UserFollowService implements IUserFollowService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async followUser(followeeId: UserId, isBlock = false): Promise<void> {
    await this.followOrBlockUser(followeeId, false);
  }

  async blockUser(followeeId: UserId): Promise<void> {
    await this.followOrBlockUser(followeeId, true);
  }

  async isFollowing(followeeId: UserId): Promise<boolean> {
    return await this.isFollwingOrIsBlockUsed(followeeId, false);
  }

  async isBlocked(followeeId: UserId): Promise<boolean> {
    return await this.isFollwingOrIsBlockUsed(followeeId, true);
  }

  async unfollowUser(followeeId: UserId): Promise<void> {
    this.unFollowUserOrUnBlockUser(followeeId);
  }

  async unblockUser(followeeId: UserId): Promise<void> {
    this.unFollowUserOrUnBlockUser(followeeId);
  }

  async getFollowers(): Promise<UserRelationView[]> {
    const followerId = await this.getFollowerIdFromContext();
    const followers = await this.repository.client.userFollow.findMany({
      where: {
        followeeId: followerId.value,
        isBlock: false,
      },
      select: prismaUserFollowWithFolloweeSelect,
    });

    return followers.map(mapPrismaUserFollowWithFolloweeToUserRelationView);
  }

  async getFollowing(): Promise<MainUser[]> {
    return await this.getFollowingOrBlockedUsers(false);
  }

  async getBlockedUsers(): Promise<MainUser[]> {
    return await this.getFollowingOrBlockedUsers(true);
  }

  private async getFollowingOrBlockedUsers(
    isBlock: boolean,
  ): Promise<MainUser[]> {
    const followerId = await this.getFollowerIdFromContext();
    const followers = await this.repository.client.userFollow.findMany({
      where: {
        followeeId: followerId.value,
        isBlock,
      },
      include: {
        followee: true,
      },
    });

    return followers.map((f) => f.followee);
  }

  private async followOrBlockUser(followeeId: UserId, isBlock: boolean) {
    const followerId = await this.getFollowerIdFromContext();
    await this.repository.client.userFollow.upsert({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: followeeId.value,
        },
      },
      update: {
        isBlock,
        followOrBlockedAt: new Date(),
      },
      create: {
        followerId: followerId.value,
        followeeId: followeeId.value,
        isBlock,
      },
    });
  }

  private async isFollwingOrIsBlockUsed(followeeId: UserId, isBlock: boolean) {
    const followerId = await this.getFollowerIdFromContext();
    const follow = await this.getFollow(followerId, followeeId);
    return follow !== null && follow.isBlock === isBlock;
  }

  private async unFollowUserOrUnBlockUser(followeeId: UserId) {
    const followerId = await this.getFollowerIdFromContext();
    await this.repository.client.userFollow.delete({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: followeeId.value,
        },
      },
    });
  }

  private async getFollowerIdFromContext() {
    const authUserId = this.user().id;
    const mainUser = await this.repository.client.mainUser.findUnique({
      where: { id: authUserId.value },
    });
    if (!mainUser) {
      throw new InvalidIdException(authUserId);
    }
    return idOf<'user'>(mainUser.id);
  }

  private async getFollow(followerId: UserId, followeeId: UserId) {
    return await this.repository.client.userFollow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: followerId.value,
          followeeId: followeeId.value,
        },
      },
    });
  }

  private user(): RequestContextUser {
    if (this.requestContext.isSystem) throw new InvalidAccessException();
    return this.requestContext.user;
  }
}
