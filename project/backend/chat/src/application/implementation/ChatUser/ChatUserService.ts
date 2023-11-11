import { Resolver } from '@ft_transcendence/common/di/Container';
import { invalidId } from '../../../exception/invalidId';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { RequestContext } from '../../RequestContext';
import { InvalidAccessException } from '../../exception/InvalidAccessException';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IChatUserService } from '../../interface/ChatUser/IChatUserService';
import {
  ChatUserId,
  ChatUserView,
} from '../../interface/ChatUser/view/ChatUserView';
import { IRepository } from '../../interface/IRepository';
import { mapPrismaUserToChatUserView } from './mapPrismaUserToChatUserView';

export class ChatUserService implements IChatUserService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: readonly ChatUserId[],
  ): Promise<(ChatUserView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaUsers = await this.repository.client.chatUser.findMany({
      where: { id: { in: stringIds } },
    });
    return sortAs(
      prismaUsers.map(mapPrismaUserToChatUserView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async create(): Promise<ChatUserView> {
    const authUser = this.getAuthUserIdFromContext()
    const prismaUser = await this.repository.client.chatUser.create({
      data: { authUserId: authUser.value },
    });
    return mapPrismaUserToChatUserView(prismaUser);
  }
  
  private getAuthUserIdFromContext() {
    const authUser = this.requestContext.user;
    if (!authUser) {
      throw new InvalidAccessException(); // requestContext.user가 없다 === 로그인 상태가 아니다.
    }
    return authUser.id;
  }
}
