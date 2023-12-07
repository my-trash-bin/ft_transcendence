import { getSocket } from '@/lib/Socket';
import { useEffect, useState, useCallback } from 'react';

export function LiveStatus({ targetId }: { targetId: string }) {
  const [active, setActive] = useState<'online' | 'offline' | 'on game'>(
    'offline',
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
      if (targetId === data.userId && data.status === 'online') {
        setActive('online');
      }
      if (targetId === data.userId && data.status === 'offline') {
        setActive('offline');
      }
    },
    [targetId],
  );

  useEffect(() => {
    socket.on('userStatus', handleStatus);
    return () => {
      socket.off('userStatus', handleStatus);
    };
  }, [handleStatus, socket, targetId]);

  return (
    <div className="flex flex-row items-center gap-sm">
      <div className={`w-[10px] h-[10px] rounded-[10px] ${activeColor}`} />
      <p className="text-sm">{active}</p>
    </div>
  );
}
