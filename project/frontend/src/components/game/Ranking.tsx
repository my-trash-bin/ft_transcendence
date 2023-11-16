import RankingCard from './RankingCard';
import { mockRankings } from './mockRankings';
import { mockUser } from './mockUser';

export function Ranking() {
  return (
    <div>
      <RankingCard
        rank={mockUser[0].rank}
        name={mockUser[0].name}
        avatar={mockUser[0].avatar}
        isUser={true}
      />
      <div className={'max-w-[620px] mx-auto'}>
        {mockRankings.map((item) => (
          <RankingCard
            key={item.id}
            rank={item.rank}
            name={item.name}
            avatar={item.avatar}
            isUser={false}
          />
        ))}
      </div>
    </div>
  );
}
