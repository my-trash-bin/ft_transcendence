import Image from 'next/image';

export function SelectChannel({ myChannel }: { myChannel: boolean }) {
  const my = myChannel ? 'text-chat-color1 shadow-md' : 'text-dark-gray';
  const all = !myChannel ? 'text-chat-color1 shadow-md' : 'text-dark-gray';

  return (
    <div className="w-[270px] h-[50px] mb-[5px] flex flex-row items-center justify-between">
      <div className="w-[140px] h-[30px] pl-[7px] pr-[7px] bg-default rounded-[20px] flex flex-row justify-between items-center">
        <button
          className={`w-[58px] h-[20px] text-[13px] bg-white rounded-[20px]  ${my}`}
        >
          내채널
        </button>
        <button
          className={`w-[58px] h-[20px] text-[13px] bg-white rounded-[20px] ${all}`}
        >
          모든채널
        </button>
      </div>
      <button>
        <Image
          alt="add channel"
          src="/icon/add.svg"
          width={25}
          height={25}
          layout="relative"
        />
      </button>
    </div>
  );
}
