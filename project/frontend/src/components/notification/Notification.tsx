'use client';
import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NotifBox } from './NotifBox';
import { inviteStore } from '../pong/Update';

export function Notification() {
  const [isHovered, setIsHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [newNotif, setNewNotif] = useState(false);
  const socket = getSocket();
  const { setInvite } = inviteStore();

  const handleInvited = (friendNickname: string, mode: string) => {
    setInvite(friendNickname, mode);
    console.log('invited', friendNickname, mode);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('newGameInvitaion', handleInvited);
    return () => {
      socket.off('newGameInvitaion', handleInvited);
    };
  }, [socket, handleInvited]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('friendIsOffline', (friendId: string) => {
      console.log('friendIsOffline', friendId);
    });
    return () => {
      socket.off('friendIsOffline');
    };
  });

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('noti', () => setNewNotif(true));
    return () => {
      socket.off('noti');
    };
  });

  return (
    <div
      className={`relative mt-xl w-[30px] h-[30px] \
    rounded-full flex justify-center items-center ${
      isHovered || active ? 'bg-dark-purple' : null
    }`}
    >
      <Image
        src="/icon/bell.svg"
        alt="setting-icon"
        width={20}
        height={20}
        style={{
          filter: isHovered || active ? 'invert(1)' : 'invert(0)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setActive(!active);
          setNewNotif(false);
        }}
      />
      {newNotif ? (
        <div
          className={`absolute left-[16px] bottom-[18px] w-[10px] h-[10px] rounded-full \
          ${isHovered || active ? 'bg-light-background' : 'bg-dark-purple'} `}
        />
      ) : null}
      <NotifBox active={active} setActive={setActive} />
    </div>
  );
}
