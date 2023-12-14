'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InviteModal from '../game/InviteModal';
import MatchingModal from '../game/MatchingModal';
import useNewFriend from '../notification/NewFriendToast';
import { Notification } from '../notification/Notification';
import { getGameSocket } from '../pong/gameSocket';
import useStore from '../pong/Update';
import useFriendInviteStore from './FriendInvite';
import Logo from './Logo';
import NavIcon from './NavIcon';
import useMatching from './useMatching';
import useNotAllowedPong from '../game/notAllowedPong';

const Navbar = () => {
  const [showInvitationExpiredToast, setShowInvitationExpiredToast] = useState(false);
  const { isNewFriendOpen, friendName } = useNewFriend();
  const { isMatchingOpen, closeMatching } = useMatching();
  const { isInviteOpen, closeInvite } = useFriendInviteStore();
  const [errorMessage, setErrorMessage] = useState(() => '');
  const socket = getGameSocket();
  const router = useRouter();
  const { setIsPlayer1 } = useStore();
  const { isOpen, closeToast } = useNotAllowedPong();

  useEffect(() => {
    const handlePlayerRole = (role: string) => {
      setIsPlayer1(role === 'player1');
      console.log('playerRole', role);
      socket.off('playerRole', handlePlayerRole);
    };
    socket.on('playerRole', handlePlayerRole);
    return () => {
      socket.off('playerRole', handlePlayerRole);
    };
  }, [socket, setIsPlayer1]);

  useEffect(() => {
    setTimeout(() => closeToast(), 2000);
  }, [isOpen, closeToast]);

  useEffect(() => {
    const handleGoPong = (data: {
      ok: boolean;
      msg?: string;
      clientIds?: string[];
    }) => {
      if (!data.clientIds || !data.clientIds.includes(socket.id)) {
        return;
      }
      if (data.ok) {
        router.push('/pong');
      } else {
        alert(`요청이 실패했습니다.: ${data.msg ?? '알수없는 사유'}`);
      }
      closeInvite();
      closeMatching();
    };
    socket.on('GoPong', handleGoPong);
    return () => {
      socket.off('GoPong', handleGoPong);
    };
  }, [closeInvite, closeMatching, socket, router]);

  useEffect(() => {
    const handleGameInvitationExpired = () => {
      if (!showInvitationExpiredToast) {
        console.log('gameInvitationExpired');
        setShowInvitationExpiredToast(true);
        setTimeout(() => setShowInvitationExpiredToast(false), 2000);
      }
    };
    socket.on('gameInvitationExpired', handleGameInvitationExpired);
    socket.on('failToInvite', (data: { msg: string }) => {
      setErrorMessage(data.msg ?? '초대가 실패했습니다.');
      setTimeout(() => setErrorMessage(() => ''), 2000);
    });
    return () => {
      socket.off('gameInvitationExpired', handleGameInvitationExpired);
      socket.off('failToInvite');
    };
  }, [socket, setShowInvitationExpiredToast, showInvitationExpiredToast]);

  const css =
    'fixed w-[300px] h-[100px] left-1/2 p-sm transform -translate-x-1/2 translate-y-1/2 flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50 text-h3';
  return (
    <>
      {isOpen && (
        <div className= {css}>pong 게임을 하고있지 않아요!</div>
      )}
      {showInvitationExpiredToast && (
        <div className={css}>만료된 초대장이에요!</div>
      )}
      {errorMessage && <div className={css}>{errorMessage}</div>}
      {isNewFriendOpen && (
        <div className={css}>{friendName}님과 친구가 되었습니다!</div>
      )}
      {isInviteOpen && <InviteModal />}
      {isMatchingOpen && <MatchingModal />}
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
