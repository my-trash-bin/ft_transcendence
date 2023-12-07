import Image from 'next/image';

export function UserInfo({
  imageUri,
  username,
  onActive,
}: Readonly<{
  imageUri: any;
  username: any;
  onActive: boolean;
}>) {
  const active = onActive ? 'Active' : 'Inactive';
  const activeStyle = onActive
    ? '.border-live-interactive'
    : 'bg-gray-interactive';

  return (
    <div className="h-[80px] w-[95%] border-b border-default relative">
      <div className="w-[45px] h-[50px] absolute left-[30px] top-[20px]">
        <Image
          alt="userImage"
          src={imageUri}
          width={35}
          height={40}
          layout="relative"
        />
      </div>
      <p className="top-[10px] left-[100px] text-[22px] absolute">{username}</p>
      <div
        className={`absolute w-[8px] h-[8px] rounded-[50px] top-[50px] left-[100px] translate-y-[50%]
        ${activeStyle}`}
      ></div>
      <p className="absolute left-[120px] top-[49px] text-[12px]">{active}</p>
    </div>
  );
}
