'use client';
import withAuth from '@/components/auth/Auth';
import { AchivementArticle } from '../../../components/profile/achivement/AchivementArticle';

function ProfilePage() {
  return (
    <div className="w-[100%] h-[100%] bg-light-background rounded-lg">
      <AchivementArticle />
    </div>
  );
}

export default withAuth(ProfilePage);
