'use client';
import Image from 'next/image';
import { useState } from 'react';
import { io } from 'socket.io-client';
import { NotifBox } from './NotifBox';

export function Notification() {
  const [isHovered, setIsHovered] = useState(false);
  const [active, setActive] = useState(false);
  // TODO : call api to fetch noti table

  const socket = io();
  socket.on('newNotif', () => console.log('get socket signal'));

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
        onClick={() => setActive(!active)}
      />
      <NotifBox />
    </div>
  );
}
