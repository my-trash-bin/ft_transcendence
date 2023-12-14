import { getSocket } from '@/lib/Socket';
import { ChannelButton } from './ChannelButton';
import useToast from '../common/useToast';
export function SelectPenalty({
  channelId,
  memberId,
}: Readonly<{ channelId: string; memberId: string }>) {
  const { openIsKickUser, openIsBanUser, openIsMuteUser, openIsPromoteUser } = useToast();
  const kickBanPromote = (actionType: string) => {
    getSocket().emit('kickBanPromote', {
      actionType,
      channelId,
      memberId,
    });
    if (actionType === 'KICK') {
      openIsKickUser();
    } else if (actionType === 'BANNED') {
      openIsBanUser();
    } else if (actionType === 'MUTE') {
      openIsMuteUser();
    } else if (actionType === 'PROMOTE') {
      openIsPromoteUser();
    }
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
        />
        <ChannelButton
          onClick={handleBan}
          text="ban"
          width="40px"
          height="25px"
          classStyle="text-[11px] bg-ball-pink"
        />
      </div>
      <div>
        <ChannelButton
          onClick={handleMute}
          text="mute"
          width="40px"
          height="25px"
          classStyle="text-[11px] bg-ball-pink"
        />
        <ChannelButton
          onClick={handlePromote}
          text="prom"
          width="40px"
          height="25px"
          classStyle="text-[11px]"
        />
      </div>
    </div>
  );
}
