import { TargetUserDto } from '@/api/api';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';

export function FriendSetting({ targetId }: { targetId: string }) {
  const [active, setActive] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { api } = useContext(ApiContext);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setActive(false);
      }
      event.stopPropagation();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unfollowUser = useCallback(async () => {
    try {
      const requestData: TargetUserDto = { targetUser: targetId };
      alert('call request unfriend api');
      await api.userFollowControllerUnfollowUser(requestData);
      console.log('Unfriend request sent successfully');
    } catch (error) {
      console.error('Error sending unfriend request:', error);
    }
  }, [api, targetId]);

  const blockUser = useCallback(async () => {
    try {
      const requestData: TargetUserDto = { targetUser: targetId };
      alert('call block api');
      await api.userFollowControllerBlockUser(requestData);
      console.log('Block sent successfully');
    } catch (error) {
      console.error('Error sending block:', error);
    }
  }, [api, targetId]);

  const buttonClass = 'w-[58px] text-center text-black text-sm font-semibold';
  return (
    <div>
      <Image
        src="/icon/message-setting.svg"
        alt="setting-icon"
        width={20}
        height={20}
        className="rotate-90 cursor-pointer"
        onClick={() => setActive(!active)}
      />
      {active && (
        <div
          ref={boxRef}
          className="w-[60px] bg-light-background border-2 border-dark-gray rounded-xs absolute"
        >
          <div className="flex flex-col justify-center">
            <button className={buttonClass} onClick={unfollowUser}>
              친구 끊기
            </button>
            <hr />
            <button className={buttonClass} onClick={blockUser}>
              차단 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
