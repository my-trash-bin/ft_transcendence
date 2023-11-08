import { DmUserList } from '../../components/dm/dm-user/DmUserList';
import { MessageSearch } from '../../components/dm/message-search/MessageSearch';
import { MessageBox } from '../../components/dm/message/MessageBox';

export default function DmPage() {
  return (
    <div className="flex flex-row">
      <div className="w-[380px] h-[768px] border-r ml-[10px]">
        <MessageSearch />
        <p className="w-[inherit] mb-[15px] text-[15px] text-dark-gray">
          모든 메세지
        </p>
        <DmUserList />
      </div>
      <div className="w-[520px] h-[768px]">
        <MessageBox />
      </div>
    </div>
  );
}
