'use client';
import withAuth from '@/components/auth/withAuth';
import Navbar from '@/components/common/Navbar';
import FriendAvatar from '@/components/friend/utils/FriendAvatar';

function Page() {
  const CSS =
    'bg-default-interactive rounded-md w-xl h-md ' +
    'border-3 border-dark-purple ' +
    'text-dark-purple font-bold text-h2 text-center font-jeonju align-text-middle ' +
    'cursor-pointer transition-all duration-300 ease-in-out hover:shadow-custom hover:-translate-y-[0.148rem] ' +
    'flex justify-center items-center';
  return (
    <div className="flex flex-row w-[inherit] h-[100%]">
      <Navbar />
      <div className="w-2xl h-[400px] m-auto">
        <div className="w-[100%] h-[100%] bg-light-background rounded-lg flex flex-col gap-2xl justify-center items-center">
          <p className="text-dark-purple text-h2 font-taebaek">
            핑퐁 세상에 오신 것을 환영합니다~{' '}
          </p>
          <div className="flex flex-row gap-xl">
            <FriendAvatar imageUrl={'/avatar/avatar-small.svg'} size={50} />
            <FriendAvatar imageUrl={'/avatar/avatar-black.svg'} size={50} />
            <FriendAvatar imageUrl={'/avatar/avatar-big.svg'} size={50} />
            <FriendAvatar imageUrl={'/avatar/avatar-blue.svg'} size={50} />
          </div>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/auth/42" className={CSS}>
            42 intra 로그인
          </a>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Page, 'root');
