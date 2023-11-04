import Image from 'next/image';

type AvatarProps = {
  name: string;
  isSelected: boolean;
};

export default function Avatar({ name, isSelected }: AvatarProps) {
  const src = `/avatar/${name}`;

  const activeClass: string = isSelected
    ? 'border-3 border-dark-purple hover:bg-light-background'
    : 'border-3 border-default hover:border-dark-gray hover:bg-light-background';
  const className = `w-sm h-sm rounded-full flex items-center justify-center mb-[40px] ${activeClass}`;
  return (
    <Image
      src={src}
      priority={true}
      alt="avatar"
      width={100}
      height={100}
      className={className}
    />
  );
}
