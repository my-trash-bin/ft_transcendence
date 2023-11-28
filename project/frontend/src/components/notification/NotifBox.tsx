import { NotiCard } from './NotiCard';
import mockNotifications from './mockNoti';
import { useEffect, useRef, useState } from 'react';
import { SelectNotif } from './SelectNotif';

export function NotifBox({
  active,
  setActive,
}: {
  active: boolean;
  setActive: Function;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const data = mockNotifications;
  const [showAll, setShowAll] = useState(false);
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
  return (
    active && (
      <div
        ref={boxRef}
        className={
          'w-[250px] h-[400px] fixed left-[100px] bottom-[50px] \
        rounded-[5px] border-3 border-dark-purple bg-default \
        felx flex-col items-center justify-center \
        overflow-y-scroll'
        }
      >
        <SelectNotif showAll={showAll} setShowAll={setShowAll} />
        {data.map((val) => {
          if (showAll || !val.isRead) {
            return (
              <NotiCard
                key={val.id}
                isRead={val.isRead}
                content={val.contentJson}
              />
            );
          }
          return null;
        })}
      </div>
    )
  );
}
