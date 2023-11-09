import { cva, type VariantProps } from 'class-variance-authority';

const LongCardCVA = cva(
  [
    'text-dark-gray-interactive',
    'font-semibold',
    'rounded-md',
    'border-3',
    'px-sm',
    'mx-auto',
    'relative',
    'flex',
    'items-center',
    'transition-all',
    'duration-300',
    'ease-in-out',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        small: ['w-[350px] h-[40px] ', 'text-xl ', 'mb-md '],
        medium: ['w-[600px] h-sm ', 'text-h2 ', 'mb-xl '],
        big: ['w-[600px] h-md ', 'text-h2 ', 'mb-2xl '],
      },
      color: {
        default: ['bg-white-interactive ', 'border-gray-interactive'],
        color: ['bg-default-interactive ', 'border-dark-purple-interactive'],
      },
    },
    compoundVariants: [
      {
        size: 'big',
        color: 'color',
        class: 'user',
      },
      {
        size: 'small',
        color: 'default',
        class: 'small',
      },
    ],
    defaultVariants: {
      size: 'medium',
      color: 'default',
    },
  },
);

export interface LongCardProps extends VariantProps<typeof LongCardCVA> {
  children?: React.ReactNode;
}

export const LongCard: React.FC<LongCardProps> = ({
  size,
  color,
  children,
  ...props
}) => (
  <div className={LongCardCVA({ size, color })} {...props}>
    {children}
  </div>
);
