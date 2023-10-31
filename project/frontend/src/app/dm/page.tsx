import DmUserList from '../../../components/channel/DmUserList';
import MessageSearch from '../../../components/channel/MessageSearch';
import layout from './DmLayout.module.css';

export default function dmHome() {
  return (
    <>
      <div className={layout.dm}>
        {/* <nav className={styles.layout}>
          <Navbar />
        </nav> */}
        <MessageSearch />
        <DmUserList />
      </div>
    </>
  );
}
