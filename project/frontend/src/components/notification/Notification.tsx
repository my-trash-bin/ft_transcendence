'use client';
import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NotifBox } from './NotifBox';

export function Notification() {
  const [isHovered, setIsHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [newNotif, setNewNotif] = useState(false);
  const socket = getSocket();


  const handleNoti = () => {
    setNewNotif(true);
  }

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('noti', handleNoti);
    return () => {
      socket.off('noti');
    };
  }), [socket, handleNoti];

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
