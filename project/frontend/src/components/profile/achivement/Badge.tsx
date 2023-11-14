import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

export const badge = cva(
  [
    'flex flex-col items-center justify-center',
    'w-full h-full',
    'bg-white-interactive rounded-md border-2 border-gray',
    'py-sm',
    'transition-all',
    'duration-300',
    'ease-in-out',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        default: ['font-semibold text-center text-xl'],
        small: ['font-semibold text-center text-lg'],
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
}

export const Badge: React.FC<BadgeProps> = ({
  size,
  nameContent,
  commentContent,
  imageURL,
}) => {
  const imageSizeStyles: { width: number; height: number } =
    size === 'small' ? { width: 75, height: 75 } : { width: 100, height: 100 };

  return (
    <div className={badge({ size })}>
      <Image src={imageURL} priority={true} alt="badge" {...imageSizeStyles} />
      <div className="pt-sm">{nameContent}</div>
      <div className={'font-normal text-center text-md align-top'}>
        {commentContent}
      </div>
    </div>
  );
};
