import { ChannelInput } from '@/components/channel/ChannelInput';
import { ChannelList } from '@/components/channel/ChannelList';
import { MainLayout } from '@/components/common/MainLayout';
import Navbar from '../../components/common/navbar';

export default function ChannelHome() {
  return (
    <div className="flex flex-row">
      <Navbar />
      <MainLayout>
        <div className="ml-[30px] w-[350px] h-[768px] border-r ">
          <ChannelInput />
          <p className="text-[15px] mt-[15px] mb-[15px]">내 채널</p>
          <ChannelList />
        </div>
      </MainLayout>
    </div>
  );
}
