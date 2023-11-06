import { Id } from '../../Id';
import { UserId } from '../../User/view/UserView';

export type NotificationId = Id<'notification'>;

export interface NotificationView {
  id: NotificationId;
  userId: UserId;
  isRead: boolean;
  createdAt: Date;
  contentJson: string;
}
