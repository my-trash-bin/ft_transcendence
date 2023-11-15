'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChannelSettingModal } from './modals/ChannelSettingModal';

export function ChannelInfo() {
  const channelData = {
    channelName: 'channel name',
  };
  const [isOpen, setIsOpen] = useState(false);
  const modalClose = () => {
    setIsOpen(false);
  };
  const modalOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <ChannelSettingModal isOpen={isOpen} closeModal={modalClose} />
      <div className="w-[inherit] h-[80px] border-b border-default relative flex justify-center items-center">
        <h3>{channelData.channelName}</h3>
        <button
          className="absolute right-[15px] top-[25px] w-[25px] h-[30px]"
          onClick={modalOpen}
        >
          <Image
            alt="message-setting"
            src={'/icon/message-setting.svg'}
            width={35}
            height={50}
            layout="relative"
          ></Image>
        </button>
      </div>
    </>
  );
}
