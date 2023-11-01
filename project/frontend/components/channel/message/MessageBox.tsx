import { UserInfo } from './UserInfo';

export function MessageBox() {
  const imageUri = '/images/avataaars.svg';
  const username = 'user3';
  return <UserInfo imageUri={imageUri} username={username} onActive={true} />;
}
