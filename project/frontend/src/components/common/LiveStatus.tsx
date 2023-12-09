import { getSocket } from '@/lib/Socket';
import { useCallback, useEffect, useState } from 'react';

export enum EnumUserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ONGAME = 'ongame',
}

const USER_STATUS_EVENT_NAME = 'userStatus';

const isValidStatus = (status: string) =>
  (
    [
      EnumUserStatus.ONLINE,
      EnumUserStatus.OFFLINE,
      EnumUserStatus.ONGAME,
    ] as string[]
  ).includes(status);

export function LiveStatus({ targetId }: { targetId: string }) {
  const [active, setActive] = useState<EnumUserStatus>(
    () => EnumUserStatus.OFFLINE,
  );
  const socket = getSocket();
  const activeColor =
    active === 'online'
      ? 'bg-default border-1 border-dark-purple'
      : active === 'offline'
      ? 'bg-gray'
      : 'bg-dark-purple';

  const handleStatus = useCallback(
    (data: { status: string; userId: string }) => {
      console.log('status', data.status, 'userId', data.userId);
      if (targetId === data.userId && isValidStatus(data.status)) {
        setActive(data.status as EnumUserStatus);
      }
    },
    [targetId],
  );

  useEffect(() => {
    socket.on(USER_STATUS_EVENT_NAME, handleStatus);
    if (targetId) {
      socket.emit(USER_STATUS_EVENT_NAME, { userId: targetId });
    }
    return () => {
      socket.off(USER_STATUS_EVENT_NAME, handleStatus);
    };
  }, [handleStatus, socket, targetId]);

  return (
    <div className="flex flex-row items-center gap-sm">
      <div className={`w-[10px] h-[10px] rounded-[10px] ${activeColor}`} />
      <p className="text-sm">{active}</p>
    </div>
  );
}
