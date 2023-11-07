'use client';
import Navbar from '../../../components/common/Navbar';
import ArchivementPage from '../../../components/profile/achivement/ArchivementPage';

export default function ProfilePage() {
  return (
    <div className="flex flex-row w-[100%] h-[100%]">
      <Navbar />
      <div className="w-[100%]">
        <div className="flex flex-col items-center">
          <ArchivementPage />
        </div>
      </div>
    </div>
  );
}
