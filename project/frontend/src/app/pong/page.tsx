'use client';
import withAuth from '@/components/auth/withAuth';
import Navbar from '../../components/common/Navbar';
import Pong from '../../components/pong/Board';

function FriendHome() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <Navbar />
      <div className="flex flex-row w-[100%]">
        <div className={`flex flex-col items-center max-w-4xl mx-auto`}>
          <Pong />
        </div>
      </div>
    </div>
  );
}

export default withAuth(FriendHome, 'friend');
