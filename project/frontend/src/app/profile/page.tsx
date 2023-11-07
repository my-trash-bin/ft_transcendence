'use client';
import Navbar from '../../components/common/navbar';
import ArchivementArticle from '../../components/profile/ArchivementArticle';
import HistoryArticle from '../../components/profile/HistoryArticle';
import ProfileArticle from '../../components/profile/ProfileArticle';

export default function FriendHome() {
  return (
    <div className="flex w-[100%] h-[100%]">
      <Navbar />
      <div className="flex flex-col">
        <ProfileArticle />
        <div className="flex flex-row">
          <ArchivementArticle />
          <HistoryArticle />
        </div>
      </div>
    </div>
  );
}
