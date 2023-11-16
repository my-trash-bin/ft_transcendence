import { MessageSearchInput } from '../dm/message-search/MessageSearchInput';
import { SelectChannel } from './SelectChannel';

export function ChannelInput({
  myChannel,
  setMyChannel,
  setSearchChannel,
}: {
  myChannel: boolean;
  setMyChannel: (param: boolean) => void;
  setSearchChannel: (param: string) => void;
}) {
  const searchChannelFunction = (searchInput: string) => {
    setSearchChannel(searchInput);
  };
  return (
    <div className="h-[140px] mt-[30px] pl-[15px] mb-[10px]">
      <h3 className="text-[32px] pl-[15px]">채널</h3>
      <SelectChannel myChannel={myChannel} setMyChannel={setMyChannel} />
      <MessageSearchInput
        height="30px"
        width="270px"
        eventFunction={searchChannelFunction}
        placeholder="채널 검색"
      />
    </div>
  );
}
