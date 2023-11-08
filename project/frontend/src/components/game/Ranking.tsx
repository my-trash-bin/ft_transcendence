import React from 'react';
import RankingCard from './RankingCard';

interface IRankingItem {
  id: number;
  rank: number;
  name: string;
  avatar: string;
}

interface IRankingProps {
  rankings: IRankingItem[];
  className?: string;
  isUser: boolean;
}

const Ranking: React.FC<IRankingProps> = ({ rankings, className, isUser }) => {
  return (
    <div className={`max-w-[620px] mx-auto ${className}`}>
      {rankings.map((item, index) => (
        <RankingCard key={item.id} item={item} isUser={isUser} />
      ))}
    </div>
  );
};
export default Ranking;
