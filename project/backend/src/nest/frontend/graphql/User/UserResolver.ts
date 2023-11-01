import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlUser } from './GraphqlUser';

@Resolver((of: any) => GraphqlUser)
export class UserResolver {
  @Query((returns) => GraphqlUser)
  async user(
    @Context() context: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<GraphqlUser> {
    // const userView = await userLoader(context, this.userService).load(idOf(id));
    // return mapUserViewToGraphqlUser(userView);
    console.log(context);
    throw new Error('Not implemented');
  }

  @Mutation((returns) => GraphqlUser)
  async createUser(
    @Args('nickname', { type: () => String }) nickname: string,
  ): Promise<GraphqlUser> {
    // const userView = await this.userService.create(nickname);
    // return mapUserViewToGraphqlUser(userView);
    throw new Error('Not implemented');
  }

  @Mutation((returns) => GraphqlUser)
  async updateUserNickname(
    @Context() context: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('nickname', { type: () => String }) nickname: string,
  ): Promise<GraphqlUser> {
    // // TODO: authorization using context
    // const userView = await this.userService.updateNickname(idOf(id), nickname);
    // return mapUserViewToGraphqlUser(userView);
    throw new Error('Not implemented');
  }

  @Mutation((returns) => Boolean)
  async deleteUser(
    @Context() context: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    // // TODO: authorization using context
    // await this.userService.delete(idOf(id));
    // return true;
    throw new Error('Not implemented');
  }
}
