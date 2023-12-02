import Image from 'next/image';
import { SelectPenalty } from '../SelectPenalty';

export function ParticipantCard({
  nickname,
  imageUrl,
  type,
  isMyself,
  channelId,
  memberId,
}: {
  nickname: string;
  imageUrl: string | undefined;
  type: string;
  isMyself: boolean;
  channelId: string;
  memberId: string;
}) {
  const button =
    type === 'ADMINISTRATOR' && !isMyself ? (
      <SelectPenalty channelId={channelId} memberId={memberId} />
    ) : (
      ''
    );
  const imagePath = imageUrl ? imageUrl : '';
  return (
    <div className="bg-white mb-[10px] pl-[10px] w-[280px] h-[70px] border border-default rounded-[10px] flex flex-row justify-between shrink-0">
      <div className="flex flex-row items-center">
        <Image alt="user avatar" src={imagePath} width={30} height={30}></Image>
        {isMyself && (
          <p className="text-[12px] self-center bg-dark-purple text-white ml-[5px] w-[18px] h-[18px] text-center rounded-md">
            나
          </p>
        )}
        <p className="ml-[10px]">{nickname}</p>
      </div>
      {button}
    </div>
  );
}
