import { DmUserList } from '../../../components/channel/dm-user/DmUserList';
import { MessageSearch } from '../../../components/channel/message-search/MessageSearch';

export default function dmHome() {
  return (
    <>
      {/* <nav className={styles.layout}>
          <Navbar />
        </nav> */}

      <div className={`${'layout.dm-left'}`}>
        <MessageSearch />
        <DmUserList />
      </div>
      <div className={`${'layout.dm-right'}`}></div>
    </>
  );
}
