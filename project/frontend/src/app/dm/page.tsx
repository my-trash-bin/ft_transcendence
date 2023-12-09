'use client';

import withAuth from '@/components/auth/Auth';
import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import Image from 'next/image';
import { useState } from 'react';

function DmPage() {
  const [searchUsername, setSearchUsername] = useState('');

  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };

  return (
    <div className="flex flex-row bg-light-background rounded-[20px] w-[inherit]">
      <div className="w-[380px] h-[750px] border-r flex flex-col items-center">
        <MessageSearch userSearchCallback={userSearchCallback} />
        <DmUserList searchUsername={searchUsername} />
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
  );
}
export default withAuth(DmPage);
