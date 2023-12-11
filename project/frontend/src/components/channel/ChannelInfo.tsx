'use client';

import Image from 'next/image';
import { useState } from 'react';
import Portal from '../common/Portal';
import { ChannelSettingModal } from './modals/ChannelSettingModal';

export function ChannelInfo({
  channelId,
  channelData,
  myAuthority,
  myNickname,
}: Readonly<{
  channelId: string;
  channelData: any;
  myAuthority: string;
  myNickname: any;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const modalClose = () => {
    setIsOpen(false);
  };
  const modalOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Portal selector={'#backdrop-root'}>
        <ChannelSettingModal
          isOpen={isOpen}
          closeModal={modalClose}
          channelId={channelId}
          myAuthority={myAuthority}
          myNickname={myNickname}
          ownerId={channelData.ownerId}
        />
      </Portal>
      <div className="w-[95%] h-[80px] border-b border-default relative flex justify-center items-center">
        <h3>{channelData.title}</h3>
        <button
          className="absolute right-[15px] top-[25px] w-[25px] h-[30px]"
          onClick={modalOpen}
        >
          <Image
            alt="message-setting"
            src={'/icon/message-setting.svg'}
            width={35}
            height={50}
          />
        </button>
      </div>
    </>
  );
}
