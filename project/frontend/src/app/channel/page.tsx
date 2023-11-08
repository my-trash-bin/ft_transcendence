import { ChannelInput } from '@/components/channel/ChannelInput';
import { ChannelList } from '@/components/channel/ChannelList';
import { ChannleMessageBox } from '@/components/channel/ChannelMessageBox';

export default function ChannelHome() {
  return (
    <div className="flex flex-row">
      <div className="w-[380px] h-[768px] border-r ml-[10px]">
        <ChannelInput />
        <p className="text-[15px] mt-[15px] mb-[15px]">내 채널</p>
        <ChannelList />
      </div>
      <div className="w-[520px] h-[768px]">
        <ChannleMessageBox />
      </div>
    </div>
  );
}
