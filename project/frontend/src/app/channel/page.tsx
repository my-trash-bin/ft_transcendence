import { SelectChannel } from '@/components/channel/SelectChannel';
import { MessageSearchInput } from '@/components/channel/message-search/MessageSearchInput';
import Navbar from '../../components/common/navbar';

export default function ChannelHome() {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="flex flex-col h-[inherit] w-[1280px] mt-0 mb-0 ml-auto mr-auto">
        <div className="ml-[30px] w-[350px]">
          <h3 className="w-[270px] h-[50px] text-[32px] mt-[30px] mb-[10px]">
            채널
          </h3>
          <SelectChannel myChannel={true} />
          <MessageSearchInput />
        </div>
      </div>
    </div>
  );
}
