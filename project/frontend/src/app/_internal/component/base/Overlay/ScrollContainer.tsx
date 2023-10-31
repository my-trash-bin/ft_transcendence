import { CSSProperties, PropsWithChildren, useContext } from 'react';
import { OverlayContext } from './OverlayContext';

export interface ScrollContainerProps extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
}

export function ScrollContainer({
  children,
  className,
  style,
}: ScrollContainerProps) {
  const { shouldInteractive } = useContext(OverlayContext);
  const overflow = shouldInteractive ? 'auto' : 'hidden';

  return (
    <div
      className={className}
      style={{
        ...style,
        maxWidth: '100%',
        maxHeight: '100%',
        overflowX: overflow,
        overflowY: overflow,
      }}
    >
      {children}
    </div>
  );
}
