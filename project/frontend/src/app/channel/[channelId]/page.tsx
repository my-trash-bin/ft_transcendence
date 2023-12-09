'use client';
import withChannelAuth from '@/components/auth/ChannelAuth';
import { AllChannelList } from '@/components/channel/AllChannelList';
import { ChannelInput } from '@/components/channel/ChannelInput';
import { ChannleMessageBox } from '@/components/channel/ChannelMessageBox';
import { MyChannelList } from '@/components/channel/MyChannelList';
import Image from 'next/image';
import { useState } from 'react';

function ChannelHome({ params }: Readonly<{ params: { channelId: string } }>) {
  const [myChannel, setMyChannel] = useState(true);
  const [searchChannel, setSearchChannel] = useState('');

  const renderMessageBox = params.hasOwnProperty('channelId') ? (
    <ChannleMessageBox channelId={params.channelId} />
  ) : (
    <Image
      alt="dm image"
      src="/images/dm-page.png"
      priority={true}
      width={435}
      height={350}
    />
  );
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
        <div className="w-[520px] h-[750px] flex flex-col items-center">
          {renderMessageBox}
        </div>
      </div>
    </>
  );
}

export default withChannelAuth(ChannelHome);
