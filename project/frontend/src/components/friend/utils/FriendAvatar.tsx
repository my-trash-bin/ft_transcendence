import Image from 'next/image';

type FriendAvatarProps = {
  readonly src: string;
  readonly size: number;
  onClick?: () => void;
};

export default function FriendAvatar(props: FriendAvatarProps) {
  const className = `w-md h-md rounded-md
  flex items-center justify-center hover:bg-default`;
  return (
    <Image
      src={props.src}
      priority={true}
      alt="avatar"
      width={props.size}
      height={props.size}
      className={className}
      onClick={props.onClick}
    />
  );
}
