'use client';
import Navbar from '@/components/common/Navbar';
import FriendAvatar from '@/components/friend/utils/FriendAvatar';

export default function Page() {
  const bgCSS = 'bg-default-interactive rounded-md';
  const sizeCSS = 'w-xl h-md';
  const borderCSS = 'border-3 border-dark-purple';
  const textCSS =
    'text-dark-purple font-bold text-h2 text-center align-text-middle';
  const hoverCSS =
    'cursor-pointer transition-all duration-300 ease-in-out hover:shadow-custom hover:-translate-y-[0.148rem]';
  return (
    <div className="flex flex-row w-[inherit] h-[100%]">
      <Navbar />
      <div className="w-2xl h-[400px] m-auto">
        <div className="w-[100%] h-[100%] bg-light-background rounded-lg flex flex-col gap-2xl justify-center items-center">
          <p className="text-dark-purple text-h2 font-semibold">
            핑퐁 세상에 오신 것을 환영합니다~{' '}
          </p>
          <div className="flex flex-row gap-xl">
            <FriendAvatar src={'/avatar/avatar-small.svg'} size={50} />
            <FriendAvatar src={'/avatar/avatar-black.svg'} size={50} />
            <FriendAvatar src={'/avatar/avatar-big.svg'} size={50} />
            <FriendAvatar src={'/avatar/avatar-blue.svg'} size={50} />
          </div>
          <a
            href="https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=http://localhost:60080/api/auth/42/callback&client_id=u-s4t2ud-94c0c5cf7592264ccffbc786dac656324fd173fd328b1bc442dbf9e2d1f316a1"
            className={`${textCSS} ${borderCSS} ${hoverCSS} ${sizeCSS} ${bgCSS}`}
          >
            42 intra 로그인
          </a>
        </div>
      </div>
    </div>
  );
}
