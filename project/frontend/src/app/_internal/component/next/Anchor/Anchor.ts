'use client';

import Link from 'next/link';
import { AnchorHTMLAttributes, ComponentType, createElement } from 'react';

import { AnchorProps, anchor } from '../../base/Anchor/anchor';
import { enhanceAnchor } from '../../essential/Anchor/enhanceAnchor';

const NextLink = enhanceAnchor(
  anchor(Link as ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>),
);
const HTMLA = enhanceAnchor(anchor('a'));

export function Anchor({
  href,
  onPress,
  disabled,
  unfocusable,
  className,
  style,
  children,
}: AnchorProps) {
  const isExternal =
    href.startsWith('mailto:') ||
    href.startsWith('https://') ||
    href.startsWith('http://');
  return createElement(
    isExternal ? HTMLA : NextLink,
    {
      href,
      onPress,
      disabled,
      unfocusable,
      className,
      style,
    } as AnchorProps,
    children,
  );
}
