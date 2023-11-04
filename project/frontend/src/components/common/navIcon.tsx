'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavIconProps {
  type: string;
}
const NavIcon = (props: NavIconProps) => {
  const path = usePathname();
  const isActive = path === `/${props.type}`;
  const activeClass: string = isActive
    ? 'border-3 border-dark-purple hover:bg-light-background'
    : 'border-3 border-default hover:border-dark-gray hover:bg-light-background';
  const className = `w-sm h-sm rounded-full flex items-center justify-center mb-[40px] ${activeClass}`;
  return (
    <Link href={`/${props.type}`} className={className}>
      <Image
        src={`/icon/${props.type}.svg`}
        alt={`${props.type}-icon`}
        width={30}
        height={30}
      />
    </Link>
  );
};

export default NavIcon;
