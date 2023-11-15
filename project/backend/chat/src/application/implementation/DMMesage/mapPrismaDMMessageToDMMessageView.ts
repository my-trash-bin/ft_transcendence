import { idOf } from '../../../util/id/idOf';
import { DMMessageView } from '../../interface/DMMessage/view/DMMessageView';
import { PrismaDMMessage } from './PrismaDMMessage';

export function mapPrismaDMMessageToDMMessageView({
  id,
  channelId,
  memberId,
  messageJson,
  sentAt,
}: PrismaDMMessage): DMMessageView {
  return {
    id: idOf(id),
    channelId: idOf(channelId),
    memberId: idOf(memberId),
    messageJson,
    sentAt,
  };
}
