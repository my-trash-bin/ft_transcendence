import { getSocket } from '@/lib/Socket';
import { ChannelButton } from './ChannelButton';
import useToast from '../common/useToast';
export function SelectPenalty({
  channelId,
  memberId,
}: Readonly<{ channelId: string; memberId: string }>) {
  const { openMessage } = useToast();
  const kickBanPromote = (actionType: string) => {
    getSocket().emit('kickBanPromote', {
      actionType,
      channelId,
      memberId,
    });
    if (actionType === 'KICK') {
      openMessage('유저를 내보냈습니다!');
    } else if (actionType === 'BANNED') {
      openMessage('유저를 차단했습니다!');
    } else if (actionType === 'MUTE') {
      openMessage('유저의 입을 1분간 막았습니다!');
    } else if (actionType === 'PROMOTE') {
      openMessage('유저를 관리자로 임명했습니다!');
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
