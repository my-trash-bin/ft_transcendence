'use client';
import ArchivementBox from '../../components/profile/achivement/ArchivementBox';
import HistoryBox from '../../components/profile/history/HistoryBox';
import ProfileBox from '../../components/profile/ProfileBox';

export default function ProfilePage() {
  return (
    <div className="flex flex-row w-[100%] h-[100%]">
      <div className="w-[100%]">
        <div className="flex flex-col items-center">
          <ProfileBox
            avatar="/avatar/avatar-blue.svg"
            nickname="happy"
            win={3}
            lose={5}
            ratio={37}
            statusMessage={'I can do it!'}
          />
          <div className="flex flex-row">
            <ArchivementBox />
            <HistoryBox />
          </div>
        </div>
      </div>
    </div>
  );
}
