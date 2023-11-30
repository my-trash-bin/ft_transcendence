import Image from 'next/image';

export function Loading({ width }: { readonly width: number }) {
  return (
    <Image
      src={'/images/catbus.gif'}
      priority={true}
      alt="avatar"
      width={width}
      height={(width * 3) / 5}
    />
  );
}
