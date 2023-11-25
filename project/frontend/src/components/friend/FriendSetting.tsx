import Image from 'next/image';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ApiContext } from '../../app/_internal/provider/ApiContext';

interface FriendSettingProps {
  targetId: string;
  refetch: () => Promise<unknown>;
}

export function FriendSetting({ targetId, refetch }: FriendSettingProps) {
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
      await api.userFollowControllerUnfollowUser({ targetUser: targetId });
      console.log('Unfriend successfully');
      refetch();
    } catch (error) {
      console.error('Error unfriend:', error);
    }
  }, [api, targetId, refetch]);

  const blockUser = useCallback(async () => {
    try {
      await api.userFollowControllerBlockUser({ targetUser: targetId });
      console.log('Block successfully');
      refetch();
    } catch (error) {
      console.error('Error block:', error);
    }
  }, [api, targetId, refetch]);

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
