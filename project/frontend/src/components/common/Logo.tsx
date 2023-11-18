import Image from 'next/image';

export default function Logo() {
  return (
    <div className="w-sm h-sm mt-[30px] mb-[40px]">
      <Image
        src="/avatar/avatar-black.svg"
        priority={true}
        alt="totoro"
        width={50}
        height={50}
      />
    </div>
  );
}
