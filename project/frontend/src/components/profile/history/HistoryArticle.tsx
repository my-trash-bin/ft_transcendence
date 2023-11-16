import { Title } from '@/components/common/Title';
import { ProfileButton } from '../ProfileButton';
import { HistoryCard } from './HistoryCard';
import { mockData } from './mockDataHistory';

function HistoryArticle() {
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Title location="top-center">최근 전적</Title>
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
              isdefault={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryArticle;
