import Image from 'next/image';

export function UserInfo({
  imageUri,
  username,
  onActive,
}: {
  imageUri: string;
  username: string;
  onActive: boolean;
}) {
  return (
    <div className="w-full h-1/5 relative">
      <div className="absolute bottom-0  left-10">
        <Image alt="userImage" src={imageUri} width={45} height={62} />
      </div>
      <p>{username}</p>
      <button />
    </div>
  );
}
