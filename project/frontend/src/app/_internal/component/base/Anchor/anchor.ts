import {
  AnchorHTMLAttributes,
  ComponentType,
  ReactNode,
  createElement,
  useCallback,
} from 'react';
import { StyleProps } from '../StyleProps';

export interface AnchorProps extends StyleProps {
  href: string;
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  unfocusable?: boolean;
}

export function anchor(
  as: 'a' | ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> = 'a',
): ComponentType<AnchorProps> {
  return function Anchor({
    href,
    children,
    onPress,
    disabled,
    unfocusable,
    style,
    className,
  }: AnchorProps) {
    const enabled = !unfocusable && !disabled;
    const onClick = useCallback(() => {
      if (enabled) onPress?.();
    }, [onPress, enabled]);
    const tabIndex = unfocusable ? -1 : 0;
    return createElement(
      as,
      {
        href,
        className,
        style,
        onClick,
        tabIndex,
      },
      children,
    );
  };
}
