import Logo from './Logo';
import NavIcon from './NavIcon';
import { Notification } from '../notification/Notification';

const Navbar = () => {
  return (
    <nav className={'flex flex-col w-[80px] h-[full] bg-default items-center'}>
      <Logo />
      <NavIcon type="friend" />
      <NavIcon type="dm" />
      <NavIcon type="channel" />
      <NavIcon type="game" />
      <NavIcon type="profile" />
      <Notification />
    </nav>
  );
};

export default Navbar;
