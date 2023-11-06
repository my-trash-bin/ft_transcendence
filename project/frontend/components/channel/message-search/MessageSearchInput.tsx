import styles from './MessageSearchInput.module.css';

export function MessageSearchInput() {
  return (
    <div className={styles['message-search-input']}>
      <button className={styles['search-icon']}></button>
      <input type="text" placeholder="search user"></input>
      <button className={styles['cross-icon']}></button>
    </div>
  );
}
