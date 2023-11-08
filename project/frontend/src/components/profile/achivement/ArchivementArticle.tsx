import Link from 'next/link';
import { Badge } from './Badge';
import { mockData } from './mockData';

function ArchivementArticle() {
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple ' +
    'text-center text-black text-lg font-bold hover:bg-light-background  ' +
    'flex items-center justify-center ' +
    'absolute top-xl right-2xl';
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-bold absolute top-xl left-2xl">업적</h2>
        <Link href="/profile" className={buttonClass}>
          돌아가기
        </Link>
        <div className="grid grid-cols-3 h-[500px] mt-2xl gap-xl overflow-y-scroll">
          {mockData.map((badge) => (
            <Badge
              key={badge.key}
              imageURL={badge.imageURL}
              name={badge.name}
              explanation={badge.explanation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArchivementArticle;
