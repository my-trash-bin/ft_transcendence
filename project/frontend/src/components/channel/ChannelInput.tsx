import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import { SelectChannel } from './SelectChannel';

export function ChannelInput() {
  return (
    <>
      <h3 className="w-[270px] h-[50px] text-[32px] mt-[30px] mb-[10px]">
        채널
      </h3>
      <SelectChannel myChannel={true} />
      <MessageSearchInput height="30px" width="270px" />
    </>
  );
}
