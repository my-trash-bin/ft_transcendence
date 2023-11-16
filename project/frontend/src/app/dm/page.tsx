'use client';

import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import { getClient } from '@/lib/ApolloClient';
import { ApolloProvider } from '@apollo/client';
import Image from 'next/image';
import { useState } from 'react';

export default function DmPage() {
  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };
  const [searchUsername, setSearchUsername] = useState('');

  return (
    <ApolloProvider client={getClient()}>
      <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
        <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
          <MessageSearch userSearchCallback={userSearchCallback} />
          <p className="text-[15px] text-dark-gray mb-[15px] pl-[15px] self-start">
            모든 메세지
          </p>
          <DmUserList searchUsername={searchUsername} />
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
    </ApolloProvider>
  );
}
