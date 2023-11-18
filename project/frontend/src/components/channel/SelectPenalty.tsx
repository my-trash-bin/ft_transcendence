export function SelectPenalty() {
  return (
    <div className="h-[inherit] flex flex-col mr-[15px] pt-[3px] pb-[5px] justify-between">
      <button className="text-[11px] w-[40px] bg-purple-500 hover:bg-purple-300 text-white rounded-sm">
        kick
      </button>
      <button className="text-[11px] w-[40px] bg-purple-500 hover:bg-purple-300 text-white rounded-sm">
        ben
      </button>
      <button className="text-[11px] w-[40px] bg-purple-500 hover:bg-purple-300 text-white rounded-sm">
        mute
      </button>
    </div>
  );
}
