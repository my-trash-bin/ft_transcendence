import Image from 'next/image';
import { SelectPenalty } from '../SelectPenalty';
import { InviteButton } from './InviteButton';

export function ParticipantCard({
  nickname,
  imageUrl,
  type,
}: {
  nickname: string;
  imageUrl: string;
  type: string;
}) {
  const button = type === 'ADD' ? <InviteButton /> : <SelectPenalty />;

  return (
    <div className="bg-white mb-[10px] pl-[5px] w-[inherit] h-[70px] border border-default rounded-[10px] flex flex-row justify-between">
      <div className="flex flex-row items-center">
        <Image alt="user avatar" src={imageUrl} width={30} height={30}></Image>
        <p className="ml-[10px]">{nickname}</p>
      </div>
      {button}
    </div>
  );
}
