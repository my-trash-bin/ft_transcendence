'use client';
import { NotiCard } from './NotiCard';
import mockNotifications from './mockNoti';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function Notification() {
  const [active, setActive] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const data = mockNotifications;
  // TODO : call api to fetch noti table

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setActive(false);
      }
      event.stopPropagation();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <Image
        src="/icon/message-setting.svg"
        alt="setting-icon"
        width={20}
        height={20}
        className="rotate-90 cursor-pointer relative"
        onClick={() => setActive(!active)}
      />
      {active && (
        <div
          ref={boxRef}
          className={
            'w-[250px] h-[400px] fixed left-[100px] bottom-[50px] \
            rounded-[5px] border-3 border-dark-purple bg-default \
            felx flex-col items-center justify-center \
            overflow-y-scroll'
          }
        >
          {data.map((val) => (
            <NotiCard
              key={val.id}
              isRead={val.isRead}
              content={val.contentJson}
            />
          ))}
        </div>
      )}
    </div>
  );
}
