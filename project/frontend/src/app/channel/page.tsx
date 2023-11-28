'use client';
import { ChannelInput } from '@/components/channel/ChannelInput';
import { ChannelList } from '@/components/channel/ChannelList';
import Image from 'next/image';

import { useState } from 'react';
export default function ChannelHome() {
  const [myChannel, setMyChannel] = useState(true);
  const [searchChannel, setSearchChannel] = useState('');

  return (
    <>
      <div id="modal-channel"></div>
      <div
        className={`bg-opacity-50 flex flex-row bg-light-background rounded-[20px] w-[inherit]`}
      >
        <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
          <ChannelInput
            myChannel={myChannel}
            setMyChannel={setMyChannel}
            setSearchChannel={setSearchChannel}
          />
          <ChannelList myChannel={myChannel} searchChannel={searchChannel} />
        </div>
        <div className="w-[520px] h-[750px] flex flex-col items-center justify-center">
          <Image
            alt="dm image"
            src="/images/dm-page.png"
            priority={true}
            width={300}
            height={300}
          />
        </div>
      </div>
    </>
  );
}
