import Logo from './Logo';
import NavIcon from './NavIcon';

const Navbar = () => {
  return (
    <nav className={'flex flex-col w-[80px] h-[100%] bg-default items-center'}>
      <Logo />
      <NavIcon type="friend" />
      <NavIcon type="dm" />
      <NavIcon type="channel" />
      <NavIcon type="game" />
      <NavIcon type="profile" />
    </nav>
  );
};

export default Navbar;
