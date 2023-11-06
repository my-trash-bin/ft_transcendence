import Image from 'next/image';

type AvatarProps = {
  name: string;
  isSelected: boolean;
};

export default function SelectAvatar({ name, isSelected }: AvatarProps) {
  const src = `/avatar/${name}`;

  const activeClass: string = isSelected
    ? 'border-3 border-dark-purple bg-light-background'
    : 'border-3 border-default hover:border-dark-gray hover:bg-light-background';
  const className = `w-lg h-lg flex items-center justify-center ${activeClass}`;
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
