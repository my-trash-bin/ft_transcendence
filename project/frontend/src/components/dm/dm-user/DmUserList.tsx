'use client';

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
  // let dmRenderData: DmUser[] = data.dmUser.map((val: any) => {
  //   return {
  //     nickname: val.nickname,
  //     profileImageUrl: val.profileImageUrl,
  //     preViewMessage:
  //       val.preViewMessage.length > 25
  //         ? val.preViewMessage.slice(0, 22) + '...'
  //         : val.preViewMessage,
  //     latestTime: val.latestTime,
  //   };
  // });
  let dmRenderData: DmUser[] = [
    {
      nickname: 'test1',
      profileImageUrl: '/avatar/avatar-big.svg',
      preViewMessage: 'test1',
      latestTime: new Date(),
    },
    {
      nickname: 'test2',
      profileImageUrl: '/avatar/avatar-big.svg',
      preViewMessage: 'test2',
      latestTime: new Date(),
    },
    {
      nickname: 'test3',
      profileImageUrl: '/avatar/avatar-big.svg',
      preViewMessage: 'test3',
      latestTime: new Date(),
    },
    {
      nickname: 'test4',
      profileImageUrl: '/avatar/avatar-big.svg',
      preViewMessage: 'test4',
      latestTime: new Date(),
    },
  ];

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
