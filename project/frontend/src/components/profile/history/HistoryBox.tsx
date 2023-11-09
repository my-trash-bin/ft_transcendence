import { ProfileButton } from '../ProfileButton';
import { HistoryCard } from './HistoryCard';
import { mockData } from './mockDataHistory';

function HistoryBox() {
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg ml-[30px] relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-semibold text-dark-gray absolute top-xl left-xl">
          최근 전적
        </h2>
        <ProfileButton href="/profile/history" text="더보기" />
        <div className="flex flex-col h-[500px] mt-xl w-[90%] overflow-y-scroll">
          {mockData.map((data) => (
            <HistoryCard
              key={data.key}
              user1Name={data.user1Name}
              user2Name={data.user2Name}
              user1Avatar={data.user1Avatar}
              user2Avatar={data.user2Avatar}
              user1Score={data.user1Score}
              user2Score={data.user2Score}
              isdefault={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryBox;
