import { InvalidIdException } from '../../exception/InvalidIdException';
import { UserId } from '../User/view/UserView';
import { NotificationId, NotificationView } from './view/NotificationView';

export interface INotificationService {
  getMany(
    ids: readonly NotificationId[],
  ): Promise<(NotificationView | InvalidIdException)[]>;
  create(userId: UserId, contentJson: string): Promise<NotificationView>;
  markAsRead(id: NotificationId): Promise<NotificationView>;
}
