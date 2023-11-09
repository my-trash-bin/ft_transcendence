import { cva, type VariantProps } from 'class-variance-authority';

const LongCardCVA = cva(
  [
    'text-dark-gray-interactive',
    'font-semibold',
    'rounded-md',
    'border-3',
    'p-md',
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
        small: ['w-[200px] h-[30px]', 'text-md'],
        medium: ['w-[600px] h-[50px]', 'text-h2', 'mx-auto mb-xl'],
        big: ['w-[600px] h-[60px]', 'text-h2', 'mx-auto mb-lg '],
      },
      color: {
        default: ['bg-white-interactive', 'border-gray-interactive'],
        color: ['bg-default-interactive', 'border-dark-purple-interactive'],
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
