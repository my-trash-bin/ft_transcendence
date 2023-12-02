import { AddChannelButton } from './AddChannelButton';

export function SelectChannel({
  myChannel,
  setMyChannel,
}: {
  myChannel: boolean;
  setMyChannel: (param: boolean) => void;
}) {
  const my = myChannel ? 'text-chat-color1 shadow-md' : 'text-dark-gray';
  const all = !myChannel ? 'text-chat-color1 shadow-md' : 'text-dark-gray';
  const changeToMyChannel = () => {
    setMyChannel(true);
  };
  const changeToAllChannel = () => {
    setMyChannel(false);
  };
  return (
    <div className="h-[50px] flex flex-row items-center justify-end mr-md ">
      <div className="pr-sm">
        <div className="w-[140px] h-[30px] pl-[7px] pr-[7px] bg-default rounded-[20px] flex flex-row justify-center gap-sm items-center">
          <button
            className={`w-[58px] h-[20px] text-[13px] bg-white rounded-[20px]  ${my}`}
            onClick={changeToMyChannel}
          >
            내채널
          </button>
          <button
            className={`w-[58px] h-[20px] text-[13px] bg-white rounded-[20px] ${all}`}
            onClick={changeToAllChannel}
          >
            모든채널
          </button>
        </div>
      </div>
      <AddChannelButton />
    </div>
  );
}
