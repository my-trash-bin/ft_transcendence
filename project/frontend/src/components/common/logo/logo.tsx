import Image from 'next/image';

export default function Logo() {
  return (
    <div className="bg-white p-2 border border-purple-600 rounded-md w-16 h-16 text-center">
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
