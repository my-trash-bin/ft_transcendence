'use client';

import Image from 'next/image';
import { useState } from 'react';
import Portal from '../common/Portal';
import { ChannelSettingModal } from './modals/ChannelSettingModal';

export function ChannelInfo({ channelId }: Readonly<{ channelId: string }>) {
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
      <Portal selector={'#modal-channel'}>
        <ChannelSettingModal isOpen={isOpen} closeModal={modalClose} />
      </Portal>
      <div className="w-[95%] h-[80px] border-b border-default relative flex justify-center items-center">
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
