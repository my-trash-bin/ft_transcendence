'use client';
import { GET_DM_USERS } from '@/api/dm/DmApi';
import { getClient } from '@/lib/ApolloClient';
import { useEffect, useState } from 'react';
import { DmUser } from './DmUser';

interface DmUser {
  nickname: string;
  profileImageUrl: string;
  preViewMessage: string;
  latestTime: Date;
}

async function getDmUsers() {
  const { data }: { data: any } = await getClient().query({
    query: GET_DM_USERS,
  });
  let dmRenderData: DmUser[] = data.dmUser.map((val: any) => {
    return {
      nickname: val.nickname,
      profileImageUrl: val.profileImageUrl,
      preViewMessage:
        val.preViewMessage.length > 25
          ? val.preViewMessage.slice(0, 22) + '...'
          : val.preViewMessage,
      latestTime: val.latestTime,
    };
  });
  return dmRenderData;
}

export function DmUserList({
  searchUsername,
}: Readonly<{ searchUsername: string }>) {
  const [dmRenderData, setDmRenderData] = useState<DmUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dmData = await getDmUsers();
      setDmRenderData(
        dmData.filter((val) => val.nickname.includes(searchUsername)),
      );
    };
    fetchData();
  }, [searchUsername]);

  return (
    <div className="w-[inherit] flex-grow-1 flex flex-col items-center overflow-y-scroll">
      {dmRenderData.map((val) => {
        return (
          <DmUser
            key={val.nickname}
            imageUri={val.profileImageUrl}
            nickname={val.nickname}
            messageShortcut={val.preViewMessage}
            date={val.latestTime}
          />
        );
      })}
    </div>
  );
}
