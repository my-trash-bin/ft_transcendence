'use client';

import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { DmUser } from './DmUser';

interface DmUser {
  nickname: string;
  profileImageUrl: string;
  preViewMessage: string;
  latestTime: Date;
}

function getRenderData(userData: any, searchUser: string) {
  const filteredData = userData.filter((user: any) =>
    user.nickname.includes(searchUser),
  );

  return filteredData.map((val: any) => (
    <DmUser
      key={val.nickname}
      imageUri={val.profileImage}
      nickname={val.nickname}
      messageShortcut={val.messagePreview}
      date={val.sentAt}
    />
  ));
}

export function DmUserList({
  searchUsername,
}: Readonly<{ searchUsername: string }>) {
  const { api } = useContext(ApiContext);
  const { isLoading, data } = useQuery(
    [],
    useCallback(async () => (await api.dmControllerGetMyDmList()).data, [api]),
  );

  if (isLoading) return <p>로딩중...</p>;
  const renderData = getRenderData(data, searchUsername);

  return (
    <div className="w-[350px] h-[600px] flex-grow-1 flex flex-col items-center gap-sm overflow-y-scroll">
      {renderData}
    </div>
  );
}
