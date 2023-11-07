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
    <div className="h-[80px] w-[inherit] border-b border-default relative">
      <div className="w-[45px] h-[50px] absolute left-[5%] top-[20%]">
        <Image
          alt="userImage"
          src={imageUri}
          width={35}
          height={40}
          layout="relative"
        />
      </div>
      <p className="top-[10px] left-[120px] text-[22px] absolute">{username}</p>
      <div
        className={`absolute w-[8px] h-[8px] rounded-[50px] top-[50px] left-[120px] translate-y-[50%]
        ${activeStyle}`}
      ></div>
      <p className="absolute left-[140px] top-[50px] text-[12px]">{active}</p>
      <button className="absolute right-[15px] top-[25px] w-[25px] h-[30px]">
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
