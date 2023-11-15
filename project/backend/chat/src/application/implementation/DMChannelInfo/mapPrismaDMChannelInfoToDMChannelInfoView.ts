import { idOf } from '../../../util/id/idOf';
import { DMChannelInfoView } from '../../interface/DMChannelInfo/view/DMChannelInfoView';
import { PrismaDMChannelInfo } from './PrismaDMChannelInfo';

export function mapPrismaDMChannelInfoToDMChannelInfoView({
  channelId,
  fromId,
  name,
  toId,
}: PrismaDMChannelInfo): DMChannelInfoView {
  return {
    fromId: idOf(fromId),
    toId: idOf(toId),
    channelId: idOf(channelId),
    name,
  };
}
