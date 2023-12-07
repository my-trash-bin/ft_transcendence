import { avatarToUrl } from '@/app/_internal/util/avatarToUrl';
import Image from 'next/image';

type FriendAvatarProps = {
  readonly imageUrl?: string;
  readonly size: number;
  readonly onClick?: () => void;
};

export default function FriendAvatar(props: FriendAvatarProps) {
  return (
    <div
      className={`w-${props.size} h-${props.size} inline-block overflow-hidden`}
    >
      {props.imageUrl ? (
        <Image
          src={avatarToUrl(props.imageUrl)}
          priority={true}
          alt="avatar"
          width={props.size}
          height={props.size}
          className={
            'rounded-md flex items-center justify-center hover:bg-default'
          }
          onClick={props.onClick}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <Image
          src="/avatar/avatar-black.svg"
          priority={true}
          alt="avatar"
          width={props.size}
          height={props.size}
          className={
            'rounded-md flex items-center justify-center hover:bg-default'
          }
          onClick={props.onClick}
        />
      )}
    </div>
  );
}
