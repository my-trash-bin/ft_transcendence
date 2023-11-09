import { Title } from '@/components/common/Title';
import { ProfileButton } from '../ProfileButton';
import { Badge } from './Badge';
import { mockData } from './mockData';

function ArchivementArticle() {
  return (
    <div className="relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Title location="top-center">업적</Title>
        <ProfileButton href="/profile" text="돌아가기" />
        <div className="grid grid-cols-3 h-[500px] mt-3xl gap-xl overflow-y-scroll">
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
