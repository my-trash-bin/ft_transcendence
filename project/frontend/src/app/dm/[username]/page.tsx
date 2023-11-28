'use client';

import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import { MessageBox } from '@/components/dm/message/MessageBox';
import Image from 'next/image';
import { useState } from 'react';

const getRenderMessageBox = (params: { username: string }) => {
  if (params.hasOwnProperty('username')) {
    // create dm channel
    // getSocket().emit('createDmChannel', { memberId: params.username });
  }
  const data = params.hasOwnProperty('username') ? (
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

  return data;
};

export default function DmPage({
  params,
}: Readonly<{ params: { username: string } }>) {
  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };
  const [searchUsername, setSearchUsername] = useState('');
  const renderMessageBox = getRenderMessageBox(params);
  return (
    <>
      <div id="backdrop-root"></div>
      <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
        <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
          <MessageSearch userSearchCallback={userSearchCallback} />
          <DmUserList searchUsername={searchUsername} />
        </div>
        <div className="w-[520px] h-[750px] flex flex-col items-center justify-center">
          {renderMessageBox}
        </div>
      </div>
    </>
  );
}
