'use client';
import withAuth from '@/components/auth/withAuth';
import { AllChannelList } from '@/components/channel/AllChannelList';
import { ChannelInput } from '@/components/channel/ChannelInput';
import { MyChannelList } from '@/components/channel/MyChannelList';
import Image from 'next/image';

import { useState } from 'react';
function ChannelHome() {
  const [myChannel, setMyChannel] = useState(true);
  const [searchChannel, setSearchChannel] = useState('');
  return (
    <>
      <div id="backdrop-root" />
      <div
        className={`bg-opacity-50 flex flex-row bg-light-background rounded-[20px] w-[inherit]`}
      >
        <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
          <ChannelInput
            myChannel={myChannel}
            setMyChannel={setMyChannel}
            setSearchChannel={setSearchChannel}
          />
          {myChannel ? (
            <MyChannelList searchChannel={searchChannel} />
          ) : (
            <AllChannelList
              searchChannel={searchChannel}
              setMyChannel={setMyChannel}
            />
          )}
        </div>
        <div className="w-[520px] h-[750px] flex flex-col items-center justify-center">
          <Image
            alt="dm image"
            src="/images/dm-page.png"
            priority={true}
            width={435}
            height={350}
          />
        </div>
      </div>
    </>
  );
}

export default withAuth(ChannelHome, 'chat');
