import { Resolver } from '@ft_transcendence/common/di/Container';
import { getId } from '../../../util/id/getId';
import { sortAs } from '../../../util/sortAs';
import { ApplicationImports } from '../../ApplicationImports';
import { InvalidIdException } from '../../exception/InvalidIdException';
import { IRepository } from '../../interface/IRepository';
import { INotificationService } from '../../interface/Notification/INotificationService';
import {
  NotificationId,
  NotificationView,
} from '../../interface/Notification/view/NotificationView';
import { UserId } from '../../interface/User/view/UserView';
import { RequestContext } from '../../RequestContext';
import { invalidId } from '../../util/exception/invalidId';
import { mapPrismaNotificationToNotificationView } from './mapPrismaNotificationToNotificationView';
import { prismaUserSelect } from './PrismaNotificationSelect';

export class NotificationService implements INotificationService {
  private readonly repository: IRepository;
  private readonly requestContext: RequestContext;

  constructor(resolve: Resolver<ApplicationImports>) {
    this.repository = resolve('repository');
    this.requestContext = resolve('requestContext');
  }

  async getMany(
    ids: readonly NotificationId[],
  ): Promise<(NotificationView | InvalidIdException)[]> {
    const stringIds = ids.map(({ value }) => value);
    const prismaNotifications =
      await this.repository.client.notification.findMany({
        where: { id: { in: stringIds } },
        select: prismaUserSelect,
      });
    return sortAs(
      prismaNotifications.map(mapPrismaNotificationToNotificationView),
      stringIds,
      getId,
      invalidId,
    );
  }

  async create(userId: UserId, contentJson: string): Promise<NotificationView> {
    const prismaNotification = await this.repository.client.notification.create(
      {
        data: { userId: userId.value, contentJson },
        select: prismaUserSelect,
      },
    );

    return mapPrismaNotificationToNotificationView(prismaNotification);
  }

  async markAsRead(id: NotificationId): Promise<NotificationView> {
    const prismaNotification = await this.repository.client.notification.update(
      {
        where: { id: id.value },
        data: { isRead: true },
        select: prismaUserSelect,
      },
    );
    return mapPrismaNotificationToNotificationView(prismaNotification);
  }
}
