import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../../../application/basic/User/UserService';
import { idOf } from '../../../application/util/id/idOf';
import { GraphqlUser } from './GraphqlUser';
import { mapUserViewToGraphqlUser } from './mapUserViewToGraphqlUser';
import { userLoader } from './userLoader';

@Resolver((of: any) => GraphqlUser)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => GraphqlUser)
  async user(
    @Context() context: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<GraphqlUser> {
    const userView = await userLoader(context, this.userService).load(idOf(id));
    return mapUserViewToGraphqlUser(userView);
  }

  @Mutation((returns) => GraphqlUser)
  async createUser(
    @Args('nickname', { type: () => String }) nickname: string,
  ): Promise<GraphqlUser> {
    const userView = await this.userService.create(nickname);
    return mapUserViewToGraphqlUser(userView);
  }

  @Mutation((returns) => GraphqlUser)
  async updateUserNickname(
    @Context() context: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('nickname', { type: () => String }) nickname: string,
  ): Promise<GraphqlUser> {
    // TODO: authorization using context
    const userView = await this.userService.updateNickname(idOf(id), nickname);
    return mapUserViewToGraphqlUser(userView);
  }

  @Mutation((returns) => Boolean)
  async deleteUser(
    @Context() context: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    // TODO: authorization using context
    await this.userService.delete(idOf(id));
    return true;
  }
}
