import { ProfileButton } from '../ProfileButton';
import { Badge } from './Badge';
import { mockData } from './mockData';

function ArchivementBox() {
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-semibold text-dark-gray absolute top-xl left-xl">
          업적
        </h2>
        <ProfileButton href="/profile/achivement" text="더보기" />
        <div className="grid grid-cols-3 h-[500px] mt-xl gap-md overflow-y-scroll">
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

export default ArchivementBox;
