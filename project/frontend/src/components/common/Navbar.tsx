'use client';
import Logo from './Logo';
import NavIcon from './NavIcon';
import { Notification } from '../notification/Notification';
import { getGameSocket } from '../pong/gameSocket';
import { inviteStore } from '../pong/Update';
import { useEffect } from 'react';

const Navbar = () => {
  const socket = getGameSocket();
  const { setInvite } = inviteStore();

  const handleInvited = (inviterId: string, mode: string) => {
    setInvite(inviterId, mode);
    // noti
    console.log('invited', inviterId, mode);
  };

  useEffect(() => {
    socket.on('invitedNormalMatch', handleInvited);
    socket.on('invitedItemMatch', handleInvited);
    return () => {
      socket.off('invitedNormalMatch', handleInvited);
      socket.off('invitedItemMatch', handleInvited);
    };
  }, [socket, handleInvited]);

  useEffect(() => {
    socket.on('friendIsOffline', (friendId: string) => {
      console.log('friendIsOffline', friendId);
    });
    return () => {
      socket.off('friendIsOffline');
    };
  });

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
