'use client';

import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import { fetchMyData } from '@/lib/FetchMyData';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function DmPage() {
  const [searchUsername, setSearchUsername] = useState('');
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
  }, []);
  if (loading) return <div>loading... 👾</div>;
  if (error) return <div>error!</div>;
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
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
export default DmPage;
