import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

export const badge = cva(
  [
    'flex flex-col items-center justify-center',
    'bg-white-interactive rounded-md border-2 border-gray',
    'py-sm',
    'transition-all',
    'duration-300',
    'ease-in-out',
    'cursor-pointer',
    '',
    'font-semibold text-center',
  ],
  {
    variants: {
      size: {
        default: ['text-xl', 'w-[180px] h-[180px]'],
        small: ['text-lg', 'w-[110px] h-[110px]'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);
export interface BadgeProps extends VariantProps<typeof badge> {
  nameContent: string;
  commentContent: string | null;
  imageURL: string;
  isMine?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  size,
  nameContent,
  commentContent,
  imageURL,
  isMine = true,
}) => {
  const imageSizeStyles: { width: number; height: number } =
    size === 'small' ? { width: 60, height: 60 } : { width: 100, height: 100 };

  return (
    <div className={badge({ size })}>
      <Image
        style={isMine ? undefined : { filter: 'grayscale(100%)' }}
        src={imageURL}
        priority={true}
        alt="badge"
        {...imageSizeStyles}
      />
      <div className="pt-sm">{nameContent}</div>
      <div className={'font-normal text-center text-md align-top'}>
        {commentContent}
      </div>
    </div>
  );
};
