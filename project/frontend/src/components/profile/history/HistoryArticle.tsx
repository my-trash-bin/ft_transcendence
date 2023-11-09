import { ProfileButton } from '../ProfileButton';
import { HistoryCard } from './HistoryCard';
import { mockData } from './mockDataHistory';

function HistoryArticle() {
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 text-dark-gray font-bold absolute top-2xl left-1/2 transform -translate-x-1/2">
          최근 전적
        </h2>
        <ProfileButton href="/profile" text="돌아가기" />
        <div className="flex flex-col items-center h-[500px] mt-3xl w-[80%] overflow-y-scroll">
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
