import { cva, type VariantProps } from 'class-variance-authority';

const ButtonCVA = cva(['text-center font-sejong font-semibold'], {
  variants: {
    size: {
      small: ['w-md h-xs', 'text-md'],
      medium: ['w-lg h-sm', 'text-lg'],
      big: ['w-lg h-sm', 'text-lg', 'absolute top-xl right-xl'],
    },
    color: {
      default: [
        'bg-default hover:bg-light-background border-dark-purple',
        'text-black',
      ],
      modal: ['bg-white hover:bg-white border-dark-purple', 'text-black'],
      disabled: ['bg-gray border-dark-gray', 'text-white'],
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

export interface ButtonProps extends VariantProps<typeof ButtonCVA> {
  children?: React.ReactNode;
  readonly onClick?: () => void;
  disabled?: boolean;
  isModal?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  size,
  onClick,
  children,
  disabled = false,
  isModal = false,
}) => {
  const color = disabled ? 'disabled' : isModal ? 'modal' : 'default';
  return (
    <button
      className={`${ButtonCVA({
        size,
        color,
      })}  rounded-sm border-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
