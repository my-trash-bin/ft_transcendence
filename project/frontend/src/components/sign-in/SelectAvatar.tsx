import Image from 'next/image';

type AvatarProps = {
  readonly imageUrl: string;
  readonly isSelected?: boolean;
  readonly onClick?: () => void;
};

export function SelectAvatar({
  imageUrl,
  isSelected = false,
  onClick,
}: AvatarProps) {
  const activeClass: string = isSelected
    ? 'border-3 border-dark-purple bg-light-background'
    : 'border-3 border-default hover:border-dark-gray hover:bg-light-background';
  const className = `w-lg h-lg flex items-center justify-center ${activeClass}`;
  return (
    <Image
      src={imageUrl}
      priority={true}
      alt="avatar"
      width={100}
      height={100}
      className={className}
      onClick={onClick}
    />
  );
}
