import { ComponentType, ReactNode, useContext } from 'react';
import { AnchorProps as BaseAnchorProps } from '../../base/Anchor/anchor';
import { OverlayContext } from '../../base/Overlay/OverlayContext';
import { StyleProps } from '../../base/StyleProps';

export interface AnchorProps extends StyleProps {
  href: string;
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export function enhanceAnchor(
  AnchorComponent: ComponentType<BaseAnchorProps>,
): ComponentType<AnchorProps> {
  return function Anchor({
    href,
    children,
    disabled,
    onPress,
    className,
    style,
  }) {
    const { shouldInteractive } = useContext(OverlayContext);
    const unfocusable = shouldInteractive;
    return (
      <AnchorComponent
        href={href}
        disabled={disabled}
        onPress={onPress}
        className={className}
        style={style}
      >
        {children}
      </AnchorComponent>
    );
  };
}
