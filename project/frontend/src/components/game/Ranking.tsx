import React from 'react';
import Image from 'next/image';

interface IRankingItem {
  id: number;
  rank: number;
  name: string;
  avatar: string;
}

interface IRankingProps {
  rankings: IRankingItem[];
  className?: string;
  isUser?: boolean;
}

const Ranking: React.FC<IRankingProps> = ({ rankings, className, isUser }) => {
  return (
    <div className={`max-w-[620px] mx-auto ${className}`}>
      <ul>
        {rankings.map((item, index) => {
          const bgCSS = isUser ? 'bg-light-background-interactive rounded-md' : 'bg-white-interactive';
          const size = isUser ? 'py-sm px-lg my-xl w-full h-ms' : 'py-sm px-lg mx-auto my-lg w-[600px] h-[60px]';
          const borderCSS = isUser ? 'border-dark-purple-interactive border-3' : 'border-gray-interactive border-3';
          return (
            <li key={item.id}
              className={`text-dark-gray-interactive font-bold text-h2 \
              flex items-center justify-between \
              ${borderCSS} rounded-md \
              cursor-pointer transition-all duration-300 ease-in-out \
              hover:shadow-custom hover:-translate-y-[0.148rem]\
              ${size} ${bgCSS}
            `}>
              <span>{item.rank}.</span>
              <div className="flex items-center">
                <span>{item.name}</span>
                <div className="w-xs h-xs relative ml-md">
                  <Image
                    src={item.avatar}
                    alt={`${item.name}'s avatar`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Ranking;
