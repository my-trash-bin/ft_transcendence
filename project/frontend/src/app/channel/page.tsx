import { ChannelInput } from '@/components/channel/ChannelInput';
import { ChannelList } from '@/components/channel/ChannelList';
import { ChannleMessageBox } from '@/components/channel/ChannelMessageBox';

export default function ChannelHome() {
  return (
    <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
      <div className="w-[380px] h-[750px] border-r">
        <ChannelInput />
        <p className="text-[15px] text-dark-gray pl-[15px] mt-[15px] mb-[15px]">
          내 채널
        </p>
        <ChannelList />
      </div>
      <div className="w-[520px] h-[750px] flex flex-col items-center">
        <ChannleMessageBox />
      </div>
    </div>
  );
}
