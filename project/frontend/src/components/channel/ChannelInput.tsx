import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import { SelectChannel } from './SelectChannel';

export function ChannelInput() {
  return (
    <div className="h-[140px] mt-[30px] pl-[15px] mb-[10px]">
      <h3 className="text-[32px] pl-[15px]">채널</h3>
      <SelectChannel myChannel={true} />
      <MessageSearchInput height="30px" width="270px" />
    </div>
  );
}
