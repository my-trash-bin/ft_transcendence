import { cva, type VariantProps } from 'class-variance-authority';

export const title = cva([''], {
  variants: {
    location: {
      'top-left': ['absolute top-xl left-xl'],
      'top-right': ['absolute top-xl right-xl'],
      'top-center': ['absolute top-2xl left-1/2 transform -translate-x-1/2'],
      none: [],
    },
    font: {
      default: ['font-taebaek', 'text-h2 text-dark-gray'],
      big: ['font-taebaek', 'text-h1 text-dark-gray'],
    },
  },
  defaultVariants: {
    location: 'none',
    font: 'default',
  },
});
export interface TitleProps extends VariantProps<typeof title> {
  children?: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ location, font, children }) => (
  <div className={title({ location, font })}>{children}</div>
);
