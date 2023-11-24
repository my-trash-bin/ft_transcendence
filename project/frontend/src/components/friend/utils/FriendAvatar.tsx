import Image from 'next/image';

type FriendAvatarProps = {
  readonly imageUrl?: string;
  readonly size: number;
  onClick?: () => void;
};

export default function FriendAvatar(props: FriendAvatarProps) {
  return props.imageUrl ? (
    <Image
      src={props.imageUrl}
      priority={true}
      alt="avatar"
      width={props.size}
      height={props.size}
      className={'rounded-md flex items-center justify-center hover:bg-default'}
      onClick={props.onClick}
    />
  ) : (
    <Image
      src="/avatar/avatar-black.svg"
      priority={true}
      alt="avatar"
      width={props.size}
      height={props.size}
      className={'rounded-md flex items-center justify-center hover:bg-default'}
      onClick={props.onClick}
    />
  );
}
