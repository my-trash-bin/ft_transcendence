import { Title } from '../common/Title';
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
    <div className="w-[350px] mb-[20px] pt-lg pl-sm flex flex-col gap-md">
      <div className="flex flex-row justify-between">
        <Title font="big">채널</Title>
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
