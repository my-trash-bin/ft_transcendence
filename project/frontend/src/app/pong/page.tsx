'use client';
import withAuth from '@/components/auth/withAuth';
import Board from '../../components/pong/Board';

function PongHome() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <div className="flex flex-row w-[100%]">
        <div className={`flex flex-col items-center max-w-4xl mx-auto`}>
          <Board />
        </div>
      </div>
    </div>
  );
}

export default withAuth(PongHome, 'friend');
