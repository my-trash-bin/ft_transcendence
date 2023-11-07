'use client';
import Navbar from '../../../components/common/Navbar';
import ArchivementArticle from '../../../components/profile/ArchivementArticle';
import HistoryArticle from '../../../components/profile/HistoryArticle';
import ProfileArticle from '../../../components/profile/ProfileArticle';

export default function ProfilePage() {
  return (
    <div className="flex flex-row w-[100%] h-[100%]">
      <Navbar />
      <div className="w-[100%]">
        <div className="flex flex-col items-center">
          <ProfileArticle
            avatar="/avatar/avatar-blue.svg"
            nickname="happy"
            win={3}
            lose={5}
            ratio={37}
            statusMessage={'I can do it!'}
          />
          <div className="flex flex-row">
            <ArchivementArticle />
            <HistoryArticle />
          </div>
        </div>
      </div>
    </div>
  );
}
