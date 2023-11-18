'use client';

import { GET_DM_USERS } from '@/api/dm/DmApi';
import { useQuery } from '@apollo/client';
import { DmUser } from './DmUser';

interface DmUser {
  nickname: string;
  profileImageUrl: string;
  preViewMessage: string;
  latestTime: Date;
}

export function DmUserList({
  searchUsername,
}: Readonly<{ searchUsername: string }>) {
  const { loading, data, error } = useQuery(GET_DM_USERS);
  if (loading) return;
  if (error) return <p>데이터를 가저오기에 실패했습니다.. ☠️</p>;

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

  if (searchUsername) {
    dmRenderData = dmRenderData.filter((val) =>
      val.nickname.includes(searchUsername),
    );
  }

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
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
