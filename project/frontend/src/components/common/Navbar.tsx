'use client';
import { useEffect, useState } from 'react';
import { Notification } from '../notification/Notification';
import Logo from './Logo';
import NavIcon from './NavIcon';
import { getGameSocket } from '../pong/gameSocket';

const Navbar = () => {
  const [showInvitationExpiredToast, setShowInvitationExpiredToast] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const socket = getGameSocket();

  useEffect(() => {
    const handleGameInvitationExpired = () => {
      if (!showInvitationExpiredToast) {
        console.log('gameInvitationExpired');
        setShowInvitationExpiredToast(true);
        setTimeout(() => setShowInvitationExpiredToast(false), 2000);
      }
    };
    socket.on('gameInvitationExpired', handleGameInvitationExpired);
    socket.on('friendOffline', () => {
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 2000);
    });
    return () => {
      socket.off('gameInvitationExpired', handleGameInvitationExpired);
      socket.off('friendOffline');
    };
  }, [
    socket,
    setShowInvitationExpiredToast,
    showInvitationExpiredToast,
  ]);

  return (
    <>
    {showInvitationExpiredToast && (
      <div className="fixed w-[300px] h-[100px] left-1/2 top-1/4 flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50 text-h2">
        이미 사용한 초대장이에요!
      </div>
    )}
      {showOfflineToast && (
        <div className="fixed w-[300px] h-[100px] left-1/2 top-1/4 flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50 text-h3">
          친구가 오프라인이에요 ㅠ
        </div>
      )}
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
    </>
  );
};

export default Navbar;
