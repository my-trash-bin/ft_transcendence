'use client';

import { Api } from '@/api/api';
import { DmUserList } from '@/components/dm/dm-user/DmUserList';
import { MessageSearch } from '@/components/dm/message-search/MessageSearch';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function DmPage() {
  const [searchUsername, setSearchUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userSearchCallback = (searchUsername: string) => {
    setSearchUsername(searchUsername);
  };

  useEffect(() => {
    async function FetchMyData() {
      try {
        const data = await new Api().api.usersControllerMyProfile();
        localStorage.setItem('me', JSON.stringify(data.data));
        setLoading(false);
      } catch (e) {
        setError('error!');
      }
    }
    if (localStorage.getItem('me') === null) FetchMyData();
    else setLoading(false);
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
