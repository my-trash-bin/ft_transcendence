'use client';
import { Notification } from '../notification/Notification';
import Logo from './Logo';
import NavIcon from './NavIcon';

const Navbar = () => {
  return (
    <nav
      className={
        'flex flex-col w-[80px] min-h-[750px] h-[inherit] bg-default items-center'
      }
    >
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
