import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface FriendSettingProps {
  nickname: string;
}

function FriendSetting(props: FriendSettingProps) {
  const [isActive, setActive] = useState(false);
  const boxRef = useRef(null);

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
    setActive(!isActive);
  };

  return (
    <div className="relative">
      <Image
        src="/icon/message-setting.svg"
        alt="setting-icon"
        width={20}
        height={20}
        className="rotate-90 cursor-pointer"
        onClick={toggleBox}
      />
      {isActive && (
        <div
          ref={boxRef}
          className="absolute top-6 right-0 bg-white border p-2"
        >
          {/* Content of the little box */}
          <button onClick={() => setActive(false)}>친구 끊기</button>
        </div>
      )}
    </div>
  );
}

export default FriendSetting;
