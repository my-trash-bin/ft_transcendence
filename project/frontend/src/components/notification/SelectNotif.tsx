export function SelectNotif({
  showAll,
  setShowAll,
}: {
  readonly showAll: boolean;
  readonly setShowAll: (param: boolean) => void;
}) {
  const unread = !showAll ? 'text-chat-color1 shadow-md' : 'text-dark-gray';
  const all = showAll ? 'text-chat-color1 shadow-md' : 'text-dark-gray';
  const changeToUnread = () => {
    setShowAll(false);
  };
  const changeToAll = () => {
    setShowAll(true);
  };
  return (
    <div className="w-[140px] h-[30px] pl-[7px] pr-[7px] bg-default rounded-[20px] flex flex-row justify-center gap-sm items-center ">
      <button
        className={`w-[58px] h-[20px] text-[13px] bg-white rounded-[20px]  ${unread}`}
        onClick={changeToUnread}
      >
        Unread
      </button>
      <button
        className={`w-[58px] h-[20px] text-[13px] bg-white rounded-[20px] ${all}`}
        onClick={changeToAll}
      >
        All
      </button>
    </div>
  );
}
