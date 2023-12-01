import { cva, type VariantProps } from 'class-variance-authority';

const ButtonCVA = cva(['text-center'], {
  variants: {
    size: {
      small: ['w-md h-xs', 'border-2', 'text-lg font-bold', 'rounded-sm'],
      medium: ['w-lg h-sm', 'border-2', 'text-lg font-bold', 'rounded-sm'],
    },
    color: {
      default: [
        'hover:bg-light-background',
        'border-dark-purple',
        'bg-default',
        'text-black',
      ],
      modal: ['hover:bg-white', 'border-dark-purple', 'bg-white', 'text-black'],
      disabled: ['border-dark-gray', 'bg-gray', 'text-white', 'font-semibold'],
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
      className={ButtonCVA({ size, color })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
