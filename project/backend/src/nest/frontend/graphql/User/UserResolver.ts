import {
  Args,
  Context as Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { idOf } from '../../../../main/util/id/idOf';
import { Context } from '../../../Context';
import { MiddlewareSymbol } from '../../../Middleware';
import { GraphqlUser } from './GraphqlUser';
import { mapUserViewToGraphqlUser } from './mapUserViewToGraphqlUser';
import { userLoader } from './userLoader';

@Resolver((of: any) => GraphqlUser)
export class UserResolver {
  @Query((returns) => GraphqlUser)
  async user(
    @Ctx('req') req: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<GraphqlUser> {
    const context: Context = req[MiddlewareSymbol];
    const userView = await userLoader(
      context,
      context.container.resolve('userService'),
    ).load(idOf(id));
    return mapUserViewToGraphqlUser(userView);
  }

  @Mutation((returns) => GraphqlUser)
  async createUser(
    @Ctx('req') req: any,
    @Args('nickname', { type: () => String }) nickname: string,
  ): Promise<GraphqlUser> {
    const context: Context = req[MiddlewareSymbol];
    const userView = await context.container
      .resolve('userService')
      .create(nickname);
    return mapUserViewToGraphqlUser(userView);
  }

  @Mutation((returns) => GraphqlUser)
  async updateUserNickname(
    @Ctx('req') req: any,
    @Args('id', { type: () => ID }) id: string,
    @Args('nickname', { type: () => String }) nickname: string,
  ): Promise<GraphqlUser> {
    const context: Context = req[MiddlewareSymbol];
    const userView = await context.container
      .resolve('userService')
      .updateNickname(idOf(id), nickname);
    return mapUserViewToGraphqlUser(userView);
  }

  @Mutation((returns) => Boolean)
  async deleteUser(
    @Ctx('req') req: any,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const context: Context = req[MiddlewareSymbol];
    await context.container.resolve('userService').delete(idOf(id));
    return true;
  }
}
