'use client';
import { ChannelInput } from '@/components/channel/ChannelInput';
import { ChannelList } from '@/components/channel/ChannelList';
import { ChannleMessageBox } from '@/components/channel/ChannelMessageBox';
import { getClient } from '@/lib/ApolloClient';
import { ApolloProvider } from '@apollo/client';
import { useState } from 'react';
export default function ChannelHome() {
  const [myChannel, setMyChannel] = useState(true);
  const [searchChannel, setSearchChannel] = useState('');

  return (
    <ApolloProvider client={getClient()}>
      <div
        className={`bg-opacity-50 flex flex-row bg-light-background rounded-[20px] w-[inherit]`}
      >
        <div className="w-[380px] h-[750px] border-r">
          <ChannelInput
            myChannel={myChannel}
            setMyChannel={setMyChannel}
            setSearchChannel={setSearchChannel}
          />
          <p className="text-[15px] text-dark-gray pl-[15px] mt-[15px] mb-[15px]">
            {myChannel ? '내 채널' : '모든 채널'}
          </p>
          <ChannelList myChannel={myChannel} searchChannel={searchChannel} />
        </div>
        <div className="w-[520px] h-[750px] flex flex-col items-center">
          <ChannleMessageBox />
        </div>
      </div>
    </ApolloProvider>
  );
}
