import { idOf } from '../../../util/id/idOf';
import { NotificationView } from '../../interface/Notification/view/NotificationView';
import { PrismaNotification } from './PrismaNotification';

export function mapPrismaNotificationToNotificationView({
  id,
  userId,
  isRead,
  createdAt,
  contentJson,
}: PrismaNotification): NotificationView {
  return {
    id: idOf(id),
    userId: idOf(userId),
    isRead,
    createdAt,
    contentJson,
  };
}
