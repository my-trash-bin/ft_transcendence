import { cva, type VariantProps } from 'class-variance-authority';

const ButtonCVA = cva(['text-center'], {
  variants: {
    size: {
      small: ['w-md h-xs', 'border-2', 'text-lg font-bold', 'rounded-sm'],
    },
    color: {
      default: [
        'hover:bg-light-background',
        'border-dark-purple',
        'bg-default',
        'text-black',
      ],
      disabled: ['border-dark-gray', 'bg-gray', 'text-white', 'font-semibold'],
    },
  },

  defaultVariants: {
    size: 'small',
    color: 'default',
  },
});

export interface ButtonProps extends VariantProps<typeof ButtonCVA> {
  children?: React.ReactNode;
  readonly onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  size,
  color,
  onClick,
  children,
  disabled,
}) => {
  console.log(disabled);
  color = disabled ? 'disabled' : 'default';
  console.log(color);
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
