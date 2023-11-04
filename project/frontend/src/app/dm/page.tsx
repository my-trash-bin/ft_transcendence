import { DmUserList } from '../../../components/channel/dm-user/DmUserList';
import { MessageSearch } from '../../../components/channel/message-search/MessageSearch';
import { MessageBox } from '../../../components/channel/message/MessageBox';
import styles from '../../../styles/Home.module.css';
import Navbar from '../../components/common/navbar/navbar';

export default function DmPage() {
  return (
    <div className="flex flex-row h-full">
      <nav className={styles.layout}>
        <Navbar />
      </nav>
      <div className="flex flex-row w-full">
        <div className="w-5/12 h-full">
          <MessageSearch />
          <DmUserList />
        </div>
        <div className="w-7/12 h-full border-l  border-color6">
          <MessageBox />
        </div>
      </div>
    </div>
  );
}
