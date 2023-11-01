import { DmUserList } from '../../../components/channel/dm-user/DmUserList';
import { MessageSearch } from '../../../components/channel/message-search/MessageSearch';
import { UserInfo } from '../../../components/channel/message/UserInfo';
import Navbar from '../../../components/common/navbar/navbar';
import styles from '../../../styles/Home.module.css';

export default function DmPage() {
  return (
    <>
      <div className="flex flex-row">
        <nav className={styles.layout}>
          <Navbar />
        </nav>
        <div className="flex flex-row w-full">
          <div className="w-5/12 h-full">
            <MessageSearch />
            <DmUserList />
          </div>
          <div className="w-7/12 h-full border-l  border-color6">
            <UserInfo
              imageUri="/avatar/avatar-small.svg"
              username="user1"
              onActive={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
