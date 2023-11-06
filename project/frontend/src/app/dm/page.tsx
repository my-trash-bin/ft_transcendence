import { DmUserList } from '../../../components/channel/dm-user/DmUserList';
import { MessageSearch } from '../../../components/channel/message-search/MessageSearch';
import { MessageBox } from '../../../components/channel/message/MessageBox';
import Navbar from '../../components/common/navbar';

export default function DmPage() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <Navbar />
      <div className="flex flex-row w-[100%]">
        <div className=" w-[35%] h-full">
          <MessageSearch />
          <DmUserList />
        </div>
        <div className="w-[65%] h-full border-l  border-color6">
          <MessageBox />
        </div>
      </div>
    </div>
  );
}
