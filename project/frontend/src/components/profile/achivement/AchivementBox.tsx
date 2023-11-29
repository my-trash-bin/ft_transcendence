import { Title } from '@/components/common/Title';
import { ProfileButton } from '../ProfileButton';
import { Badge } from './Badge';
import { mockAchivementData } from './mockAchivementData';

export function AchivementBox() {
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl pb-xl flex flex-col items-center">
        <Title location="top-left">업적</Title>
        <ProfileButton href="/profile/achivement" text="더보기" />
        <div className="grid grid-cols-3 h-[500px] w-[90%] mt-xl gap-md px-sm overflow-y-scroll">
          {mockAchivementData.map((badge) =>
            badge.isMine ? (
              <Badge
                key={badge.key}
                size="small"
                nameContent={badge.name}
                commentContent={null}
                imageURL={badge.imageURL}
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}