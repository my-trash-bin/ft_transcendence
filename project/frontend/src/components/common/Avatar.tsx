import Image from 'next/image';

type AvatarProps = {
  readonly src: string;
  readonly size: number;
};

export default function Avatar(props: AvatarProps) {
  const className = `w-md h-md rounded-md
  flex items-center justify-center
  hover:bg-default
  relative left-md`;
  return (
    <div>
      <Image
        src={props.src}
        priority={true}
        alt="avatar"
        width={props.size}
        height={props.size}
        className={className}
      />
    </div>
  );
}
