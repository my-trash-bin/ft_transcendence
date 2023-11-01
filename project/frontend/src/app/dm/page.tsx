import { DmUserList } from '../../../components/channel/dm-user/DmUserList';
import { MessageSearch } from '../../../components/channel/message-search/MessageSearch';
import { UserInfo } from '../../../components/channel/message/UserInfo';

export default function FriendHome() {
  return (
    <>
      {/* <nav className={styles.layout}>
        <Navbar />
      </nav> */}
      <div className="flex flex-row">
        <div className="w-5/12 h-full">
          <MessageSearch />
          <DmUserList />
        </div>
        <div className="w-7/12 h-full">
          <UserInfo
            imageUri="/images/avataaars.svg"
            username="user1"
            onActive={true}
          />
        </div>
      </div>
    </>
  );
}
