'use client';
import withAuth from '@/components/auth/withAuth';
import { useState } from 'react';
import { BlockCardList } from '../../components/friend/BlockCardList';
import { FriendCardList } from '../../components/friend/FriendCardList';
import { SearchCardList } from '../../components/friend/SearchCardList';

function FriendPage() {
  const [activeScreen, setActiveScreen] = useState('friend');

  const changeScreen = (screenName: string) => {
    setActiveScreen(screenName);
  };

  function className(isActive: boolean): string {
    return (
      'w-[120px] h-[50px] border-3 rounded-md text-h2 hover:bg-light-background hover:border-dark-gray font-taebaek' +
      (isActive
        ? ' bg-default border-dark-purple text-dark-purple'
        : ' bg-light-gray border-gray text-gray')
    );
  }

  return (
    <div className="flex flex-row w-[100%] h-[100%]">
      <div className="w-[100%] h-[100%] bg-light-background rounded-lg">
        <div className="flex flex-col items-center w-inherit h-inherit overflow-hidden">
          <div className="grid grid-cols-3 grid-flex gap-2xl w-[600px] p-xl">
            <div className="flex justify-center">
              <button
                className={`${className(activeScreen === 'friend')} `}
                onClick={() => changeScreen('friend')}
              >
                친구 목록
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className={`${className(activeScreen === 'search')} `}
                onClick={() => changeScreen('search')}
              >
                유저 검색
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className={`${className(activeScreen === 'block')} `}
                onClick={() => changeScreen('block')}
              >
                차단 목록
              </button>
            </div>
          </div>
          {activeScreen === 'friend' && (
            <FriendCardList activeScreen={activeScreen} />
          )}
          {activeScreen === 'block' && (
            <BlockCardList activeScreen={activeScreen} />
          )}
          {activeScreen === 'search' && (
            <SearchCardList activeScreen={activeScreen} />
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(FriendPage, 'friend');
