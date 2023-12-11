'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InviteModal from '../game/InviteModal';
import { Notification } from '../notification/Notification';
import { getGameSocket } from '../pong/gameSocket';
import useFriendInviteStore from './FriendInvite';
import Logo from './Logo';
import NavIcon from './NavIcon';

const Navbar = () => {
  const [showInvitationExpiredToast, setShowInvitationExpiredToast] =
    useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const { isInviteOpen, closeAndNavigate } = useFriendInviteStore();
  const socket = getGameSocket();
  const router = useRouter();

  useEffect(() => {
    const handleGoPong = () => {
      closeAndNavigate();
      router.push('/pong');
    };
    socket.on('GoPong', handleGoPong);
    return () => {
      socket.off('GoPong', handleGoPong);
    };
  }, [closeAndNavigate, socket, router]);

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
  }, [socket, setShowInvitationExpiredToast, showInvitationExpiredToast]);

  return (
    <>
      {showInvitationExpiredToast && (
        <div className="fixed w-[300px] h-[100px] left-1/2 top-1/4 flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50 text-h2">
          만료된 초대장이에요!
        </div>
      )}
      {showOfflineToast && (
        <div className="fixed w-[300px] h-[100px] left-1/2 top-1/4 flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50 text-h3">
          친구가 오프라인이에요 ㅠ
        </div>
      )}
      {isInviteOpen && (
        <InviteModal />
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
