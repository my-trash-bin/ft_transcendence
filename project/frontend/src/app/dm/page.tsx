import { DmUserList } from '../../../components/channel/dm-user/DmUserList';
import { MessageSearch } from '../../../components/channel/message-search/MessageSearch';
import { MessageBox } from '../../../components/channel/message/MessageBox';
import Navbar from '../../../components/common/navbar/navbar';
import styles from '../../../styles/Home.module.css';

export default function DmPage() {
  return (
    <div className="flex flex-row overflow-scroll">
      <nav className={styles.layout}>
        <Navbar />
      </nav>
      <div className="flex flex-row w-full">
        <div className="w-5/12 h-full">
          <MessageSearch />
          <DmUserList />
        </div>
        <div className="w-7/12 h-full border-l  border-color6 overflow-scroll">
          <MessageBox />
        </div>
      </div>
    </div>
  );
}
