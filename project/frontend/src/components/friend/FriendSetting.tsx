import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface FriendSettingProps {
  readonly nickname: string;
}

function FriendSetting(props: FriendSettingProps) {
  const [active, setActive] = useState(false);
  const boxRef = useRef(null);
  const breakFriend = () => toast(`${props.nickname} 친구 끊기`);
  const block = () => toast(`${props.nickname} 차단`);

  useEffect(() => {
    // Add event listener to handle clicks outside of the box
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleBox = () => {
    setActive(!active);
  };
  const buttonClass = 'w-[58px] text-center text-black text-sm font-semibold';
  return (
    <div>
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
      />
      <Image
        src="/icon/message-setting.svg"
        alt="setting-icon"
        width={20}
        height={20}
        className="rotate-90 cursor-pointer"
        onClick={toggleBox}
      />
      {active && (
        <div
          ref={boxRef}
          className="w-[60px] bg-light-background border-2 border-dark-gray rounded-xs absolute"
        >
          <div className="flex flex-col justify-center">
            <button className={` ${buttonClass}`} onClick={breakFriend}>
              친구 끊기
            </button>
            <hr />
            <button className={` ${buttonClass}`} onClick={block}>
              차단 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendSetting;
