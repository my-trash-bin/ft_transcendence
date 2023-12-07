import { getSocket } from '@/lib/Socket';
import { ChannelButton } from './ChannelButton';
export function SelectPenalty({
  channelId,
  memberId,
}: Readonly<{ channelId: string; memberId: string }>) {
  const kickBanPromote = (actionType: string) => {
    getSocket().emit('kickBanPromote', {
      actionType,
      channelId,
      memberId,
    });
    alert(actionType);
  };

  const handleKick = (e: any) => kickBanPromote('KICK');
  const handleBan = (e: any) => kickBanPromote('BANNED');
  const handleMute = (e: any) => kickBanPromote('MUTE');
  const handlePromote = (e: any) => kickBanPromote('PROMOTE');

  return (
    <div className="h-[inherit] flex flex-col mr-[5px] pt-[3px] pb-[5px] justify-between">
      <div>
        <ChannelButton
          onClick={handleKick}
          text="kick"
          width="40px"
          height="25px"
          classStyle="text-[11px] bg-ball-pink"
        ></ChannelButton>
        <ChannelButton
          onClick={handleBan}
          text="ben"
          width="40px"
          height="25px"
          classStyle="text-[11px] bg-ball-pink"
        ></ChannelButton>
      </div>
      <div>
        <ChannelButton
          onClick={handleMute}
          text="mute"
          width="40px"
          height="25px"
          classStyle="text-[11px] bg-ball-pink"
        ></ChannelButton>
        <ChannelButton
          onClick={handlePromote}
          text="prom"
          width="40px"
          height="25px"
          classStyle="text-[11px]"
        ></ChannelButton>
      </div>
    </div>
  );
}
