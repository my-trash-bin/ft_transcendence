import { unwrap } from '@/api/unwrap';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/_internal/provider/ApiContext';
import { NotiCard } from './NotiCard';
import { SelectNotif } from './SelectNotif';

export function NotifBox({
  active,
  setActive,
}: {
  active: boolean;
  setActive: Function;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const { api } = useContext(ApiContext);
  const { isLoading, isError, data, refetch } = useQuery(
    'fetchNotifications',
    useCallback(
      async () =>
        unwrap(await api.notificationControllerFindManyAndUpdateRead()),
      [api],
    ),
    {
      enabled: active,
    },
  );

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
  }, [setActive]);
  return active && render();

  function render() {
    if (isLoading) return <p>로딩중</p>;
    if (isError || !data) return <p>something wrong!</p>;
    return (
      <div
        ref={boxRef}
        className={
          'w-[250px] h-[400px] fixed left-[100px] bottom-[50px] \
        rounded-[5px] border-3 border-dark-purple bg-default \
        felx flex-col items-center justify-center \
        overflow-y-scroll z-[10]'
        }
      >
        <div className="flex flex-row justify-between">
          <SelectNotif showAll={showAll} setShowAll={setShowAll} />
          <Image
            src="/icon/refresh.png"
            alt="refresh"
            width={20}
            height={20}
            className="w-[20px] h-[20px] self-center mr-sm"
            onClick={() => refetch()}
          />
        </div>
        {data &&
          data.map((val) => {
            if (showAll || !val.isRead) {
              return <NotiCard key={val.id} content={val.contentJson} />;
            }
            return null;
          })}
      </div>
    );
  }
}
