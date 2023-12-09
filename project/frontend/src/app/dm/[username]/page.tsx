'use client';

import withDmAuth from '@/components/auth/DmAuth';
import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import { MessageBox } from '@/components/dm/message/MessageBox';
import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
import { useState } from 'react';

const getRenderData = (params: any) => {
  if (params.hasOwnProperty('username'))
    return <MessageBox username={params.username} />;
  else
    return (
      <Image
        alt="dm image"
        src="/images/dm-page.png"
        priority={true}
        width={300}
        height={300}
      />
    );
};

function DmPage({ params }: Readonly<{ params: { username: string } }>) {
  const [searchUsername, setSearchUsername] = useState('');

  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };

  if (params.hasOwnProperty('username'))
    getSocket().emit('createDmChannel', {
      info: { nickname: params.username },
    });

  const data = getRenderData(params);

  return (
    <>
      <div id="backdrop-root" />
      <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
        <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
          <MessageSearch userSearchCallback={userSearchCallback} />
          <DmUserList searchUsername={searchUsername} />
        </div>
        <div className="w-[520px] h-[750px] flex flex-col items-center justify-center">
          {data}
        </div>
      </div>
    </>
  );
}

export default withDmAuth(DmPage);
