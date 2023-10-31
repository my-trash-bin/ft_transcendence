import { AnchorProps } from '../../base/Anchor/anchor';
import { Anchor as NextAnchor } from '../../next/Anchor/Anchor';

export function Anchor({
  href,
  children,
  disabled,
  onPress,
  className,
  style,
}: AnchorProps) {
  return (
    <NextAnchor
      href={href}
      disabled={disabled}
      onPress={onPress}
      className={className}
      style={style}
    >
      {children}
    </NextAnchor>
  );
}
