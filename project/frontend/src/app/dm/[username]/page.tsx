'use client';

import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import { MessageBox } from '@/components/dm/message/MessageBox';
import { fetchMyData } from '@/lib/FetchMyData';
import { getSocket } from '@/lib/Socket';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

export default function DmPage({
  params,
}: Readonly<{ params: { username: string } }>) {
  const [searchUsername, setSearchUsername] = useState('');
  const [renderMessageBox, setRenderMessageBox] = useState<ReactNode>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };

  useEffect(() => {
    try {
      fetchMyData(setLoading);
    } catch (e) {
      setError(true);
    }

    if (params.hasOwnProperty('username'))
      getSocket().emit('createDmChannel', { info: { nickname: 'testUser1' } });

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

    setRenderMessageBox(data);
  }, [params]);

  if (loading) return <div>loading... 👾</div>;
  if (error) return <div>error!</div>;

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
