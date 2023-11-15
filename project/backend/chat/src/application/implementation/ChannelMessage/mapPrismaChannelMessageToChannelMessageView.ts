import { idOf } from '../../../util/id/idOf';
import { ChannelMessageView } from '../../interface/ChannelMessage/view/ChannelMessageView';
import { PrismaChannelMessage } from './PrismaChannelMessage';

export function mapPrismaChannelMessageToChannelMessageView({
  id,
  channelId,
  memberId,
  sentAt,
  messageJson,
}: PrismaChannelMessage): ChannelMessageView {
  return {
    id: idOf(id),
    channelId: idOf(channelId),
    memberId: idOf(memberId),
    sentAt,
    messageJson,
  };
}
