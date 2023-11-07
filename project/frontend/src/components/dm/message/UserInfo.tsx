import Image from 'next/image';

export function UserInfo({
  imageUri,
  username,
  onActive,
}: Readonly<{
  imageUri: string;
  username: string;
  onActive: boolean;
}>) {
  const active = onActive ? 'Active' : 'Inavtice';
  const activeStyle = onActive
    ? '.border-live-interactive'
    : 'bg-gray-interactive';

  return (
    <div className="h-[15%] w-[100%] border-b border-default relative">
      <div className="w-[7%] h-[70%] absolute left-[5%] top-[20%]">
        <Image
          alt="userImage"
          src={imageUri}
          width={45}
          height={62}
          layout="relative"
        />
      </div>
      <p className="top-[15%] left-[17%] bottom-[50%] text-[25px] absolute">
        {username}
      </p>
      <div
        className={`absolute w-[8px] h-[8px] rounded-[50%] top-[60%] left-[17%] translate-y-[50%]
        ${activeStyle}`}
      ></div>
      <p className="absolute left-[20%] top-[60%] text-[12px]">{active}</p>
      <button className="absolute right-[5%] top-[20%] w-[5%] h-[55%]">
        <Image
          alt="message-setting"
          src={'/icon/message-setting.svg'}
          width={35}
          height={50}
          layout="relative"
        ></Image>
      </button>
    </div>
  );
}
