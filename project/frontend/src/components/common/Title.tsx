import { cva, type VariantProps } from 'class-variance-authority';

export const title = cva(['text-h2 font-semibold text-dark-gray absolute'], {
  variants: {
    location: {
      'top-left': ['top-xl left-xl'],
      'top-right': ['top-xl right-xl'],
      'top-center': ['top-2xl left-1/2 transform -translate-x-1/2'],
    },
  },
});
export interface TitleProps extends VariantProps<typeof title> {
  children?: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ location, children }) => (
  <div className={title({ location })}>{children}</div>
);
