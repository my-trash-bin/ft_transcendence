'use client';
import withAuth from '@/components/auth/withAuth';
import { AchievementBox } from '../../components/profile/achievement/AchievementBox';
import { HistoryBox } from '../../components/profile/history/HistoryBox';
import { ProfileBox } from '../../components/profile/ProfileBox';

function ProfilePage() {
  return (
    <div className="flex flex-row max-w-[100%] max-h-[100%]">
      <div className="flex flex-col items-center max-w-[100%] max-h-[100%]">
        <ProfileBox />
        <div className="flex flex-row">
          <AchievementBox />
          <HistoryBox />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage, 'profile');
