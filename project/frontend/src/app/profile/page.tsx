'use client';
import { ProfileBox } from '../../components/profile/ProfileBox';
import { AchivementBox } from '../../components/profile/achivement/AchivementBox';
import { HistoryBox } from '../../components/profile/history/HistoryBox';

export default function ProfilePage() {
  return (
    <div className="flex flex-row max-w-[100%] max-h-[100%]">
      <div className="flex flex-col items-center max-w-[100%] max-h-[100%]">
        <ProfileBox />
        <div className="flex flex-row">
          <AchivementBox />
          <HistoryBox />
        </div>
      </div>
    </div>
  );
}
