'use client';

import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import { MessageBox } from '@/components/dm/message/MessageBox';
import Image from 'next/image';
import { useState } from 'react';

export default function DmPage({ params }: { params: { username: string } }) {
  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };
  const [searchUsername, setSearchUsername] = useState('');
  const renderMessageBox = params.hasOwnProperty('username') ? (
    <MessageBox username={params.username} />
  ) : (
    <Image
      alt="dm image"
      src="/images/dm-page.png"
      priority={true}
      width={300}
      height={300}
    />
  );
  return (
    <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
      <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
        <MessageSearch userSearchCallback={userSearchCallback} />
        <p className="text-[15px] text-dark-gray mb-[15px] pl-[15px] self-start">
          모든 메세지
        </p>
        <DmUserList searchUsername={searchUsername} />
      </div>
      <div className="w-[520px] h-[750px] flex flex-col items-center justify-center">
        {renderMessageBox}
      </div>
    </div>
  );
}
