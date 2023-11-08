import { DmUserList } from '../../components/dm/dm-user/DmUserList';
import { MessageSearch } from '../../components/dm/message-search/MessageSearch';
import { MessageBox } from '../../components/dm/message/MessageBox';

export default function DmPage() {
  return (
    <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
      <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
        <MessageSearch />
        <DmUserList />
      </div>
      <div className="w-[520px] h-[750px] flex flex-col items-center">
        <MessageBox />
      </div>
    </div>
  );
}
