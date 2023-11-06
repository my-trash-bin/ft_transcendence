import styles from './MessageSearch.module.css';
import { MessageSearchInput } from './MessageSearchInput';

export function MessageSearch() {
  return (
    <div className={`${styles['message-search-bar']}`}>
      <h3>Messages</h3>
      <MessageSearchInput />
    </div>
  );
}
