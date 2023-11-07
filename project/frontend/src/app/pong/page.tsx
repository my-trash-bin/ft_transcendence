'use client';
import Navbar from '../../components/common/navbar';

export default function FriendHome() {
  return (
    <div className="flex flex-row h-[100%] w-[100%]">
      <Navbar />
      <div className="flex flex-row w-[100%]">
        <div className={`flex flex-col items-center max-w-4xl mx-auto`}>
          <section>
            Pong page!
          </section>
        </div>
      </div>
    </div>
  );
}