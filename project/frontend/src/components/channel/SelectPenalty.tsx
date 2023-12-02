import { getSocket } from '@/lib/Socket';

export function SelectPenalty({
  channelId,
  memberId,
}: Readonly<{ channelId: string; memberId: string }>) {
  const handleKick = (e) => {
    getSocket().emit('kickBanPromote', {
      actionType: 'KICK',
      channelId,
      memberId,
    });
    alert('kicked');
  };
  const handleBen = (e) => {
    getSocket().emit('kickBanPromote', {
      actionType: 'BANNED',
      channelId,
      memberId,
    });
    alert('banned');
  };
  const handleMute = (e) => {
    getSocket().emit('kickBanPromote', {
      actionType: 'PROMOTE',
      channelId,
      memberId,
    });
    alert('promoted');
  };

  return (
    <div className="h-[inherit] flex flex-col mr-[15px] pt-[3px] pb-[5px] justify-between">
      <button
        onClick={handleKick}
        className="text-[11px] w-[40px] bg-purple-500 hover:bg-purple-300 text-white rounded-sm"
      >
        kick
      </button>
      <button
        onClick={handleBen}
        className="text-[11px] w-[40px] bg-purple-500 hover:bg-purple-300 text-white rounded-sm"
      >
        ben
      </button>
      <button
        onClick={handleMute}
        className="text-[11px] w-[40px] bg-purple-500 hover:bg-purple-300 text-white rounded-sm"
      >
        mute
      </button>
    </div>
  );
}
