'use client';
import withAuth from '@/components/auth/Auth';
import { AchievementArticle } from '../../../components/profile/achievement/AchievementArticle';

function ProfilePage() {
  return (
    <div className="w-[100%] h-[100%] bg-light-background rounded-lg">
      <AchievementArticle />
    </div>
  );
}

export default withAuth(ProfilePage);
