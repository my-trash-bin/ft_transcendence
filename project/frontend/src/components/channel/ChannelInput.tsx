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
    <div className="w-[350px] mb-[20px] pt-lg pl-sm">
      <div className="flex flex-row justify-between">
        <h3 className="text-h2 font-semibold text-dark-gray text-left pb-md">
          채널
        </h3>
        <SelectChannel myChannel={myChannel} setMyChannel={setMyChannel} />
      </div>
      <MessageSearchInput
        height="30px"
        width="330px"
        eventFunction={searchChannelFunction}
        placeholder="채널 검색"
      />
    </div>
  );
}
