'use client';
import { useState } from 'react';
import Navbar from '../../components/common/navbar';
import BlockList from '../../components/friend/BlockList';
import FriendList from '../../components/friend/FriendCardList';

export default function FriendHome() {
  const [activeScreen, setActiveScreen] = useState('friend');

  const changeScreen = (screenName: string) => {
    setActiveScreen(screenName);
  };

  function className(isActive: boolean): string {
    return (
      'w-[150px] h-[60px] border-3 rounded-lg text-h2 font-bold hover:bg-light-background hover:border-dark-gray' +
      (isActive
        ? ' bg-default border-dark-purple text-dark-purple'
        : ' bg-light-gray border-gray text-gray')
    );
  }

  return (
    <div className="flex w-[100%] h-[100%]">
      <Navbar />
      <div className="w-[100%]">
        <div className="flex flex-col items-center mt-2xl ml-2xl mr-2xl">
          <div className="grid grid-cols-2 grid-flex gap-2xl w-[600px]">
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
                className={`${className(activeScreen === 'block')} `}
                onClick={() => changeScreen('block')}
              >
                차단 목록
              </button>
            </div>
          </div>
          {activeScreen === 'friend' && <FriendList />}
          {activeScreen === 'block' && <BlockList />}
        </div>
      </div>
    </div>
  );
}
