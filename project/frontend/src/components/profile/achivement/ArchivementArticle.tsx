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
        <div className="grid grid-cols-3 w-[700px] h-[500px] mt-3xl gap-xl p-md overflow-y-scroll">
          {mockData.map((badge) => (
            <Badge
              key={badge.key}
              nameContent={badge.name}
              commentContent={badge.explanation}
              imageURL={badge.imageURL}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArchivementArticle;
