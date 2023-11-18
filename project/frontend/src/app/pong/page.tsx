'use client';
import Navbar from '../../components/common/Navbar';
// import Tetris from '../../components/game/tetris/Game';
import Pong from '../../components/pong/Board';

export default function FriendHome() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <Navbar />
      <div className="flex flex-row w-[100%]">
        <div className={`flex flex-col items-center max-w-4xl mx-auto`}>
          <Pong />
          {/* <div className="bg-default-interactive"> */}
            {/* <Tetris /> */}
            {/* <Pong /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
