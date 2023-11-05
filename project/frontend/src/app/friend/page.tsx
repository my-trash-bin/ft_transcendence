'use client';
import { useState } from 'react';
import Navbar from '../../components/common/navbar';
import BlockList from '../../components/friend/BlockList';
import FriendList from '../../components/friend/FriendList';

export default function FriendHome() {
  const [activeScreen, setActiveScreen] = useState('friend');

  const changeScreen = (screenName: string) => {
    setActiveScreen(screenName);
  };

  function className(isActive: boolean): string {
    return (
      'w-[150px] h-[60px] border-3 rounded-lg text-h2 font-bold' +
      (isActive
        ? ' bg-default border-dark-purple text-dark-purple'
        : ' bg-light-gray border-gray text-gray')
    );
  }

  return (
    <div className="flex">
      <Navbar />
      <div className="flex flex-col w-[100vw] mt-2xl ml-2xl mr-2xl">
        <div className="grid grid-cols-2 grid-flex gap-2xl">
          <div className="flex justify-center items-center">
            <button
              className={`${className(activeScreen === 'friend')} `}
              onClick={() => changeScreen('friend')}
            >
              친구 목록
            </button>
          </div>
          <div className="flex justify-center items-center">
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
  );
}
