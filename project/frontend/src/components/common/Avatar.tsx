import Image from 'next/image';

type AvatarProps = {
  readonly src: string;
};

export default function Avatar(props: AvatarProps) {
  const className = `w-md h-md rounded-full
  flex items-center justify-center
  border-3 border-default hover:border-dark-purple hover:bg-default
  relative left-md`;
  return (
    <div>
      <Image
        src={props.src}
        priority={true}
        alt="avatar"
        width={50}
        height={50}
        className={className}
      />
    </div>
  );
}
