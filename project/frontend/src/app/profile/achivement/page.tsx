'use client';
import ArchivementArticle from '../../../components/profile/achivement/ArchivementArticle';

export default function ProfilePage() {
  return (
    <div className="flex flex-row w-[100%] h-[100%]">
      <div className="w-[100%]">
        <div className="flex flex-col items-center">
          <ArchivementArticle />
        </div>
      </div>
    </div>
  );
}
