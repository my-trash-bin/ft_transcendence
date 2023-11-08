import Link from 'next/link';
import { HistoryCard } from './HistoryCard';
import { mockData } from './mockDataHistory';

function HistoryArticle() {
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple ' +
    'text-center text-black text-lg font-bold hover:bg-light-background  ' +
    'flex items-center justify-center ' +
    'absolute top-xl right-2xl';
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-bold absolute top-xl left-2xl">
          최근 전적
        </h2>
        <Link href="/profile" className={buttonClass}>
          돌아가기
        </Link>
        <div className="flex flex-col h-[500px] mt-2xl w-[80%] overflow-y-scroll">
          {mockData.map((data) => (
            <HistoryCard
              key={data.key}
              user1Name={data.user1Name}
              user2Name={data.user2Name}
              user1Avatar={data.user1Avatar}
              user2Avatar={data.user2Avatar}
              user1Score={data.user1Score}
              user2Score={data.user2Score}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryArticle;
