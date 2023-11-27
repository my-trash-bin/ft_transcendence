'use client';
import Image from 'next/image';
import { useState } from 'react';
import { io } from 'socket.io-client';
import { NotifBox } from './NotifBox';
import { getSocket } from '@/lib/Socket';

export function Notification() {
  const [isHovered, setIsHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [newNotif, setNewNotif] = useState(false);
  // TODO : call api to fetch noti table

  const socket = getSocket();
  socket.on('newNotif', () => setNewNotif(true));

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
          // TODO : socket.emit that notification was read
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
