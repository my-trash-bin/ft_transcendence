import { ProfileButton } from '../ProfileButton';

function ArchivementBox() {
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-semibold text-dark-gray absolute top-xl left-xl">
          업적
        </h2>
        <ProfileButton href="/profile/achivement" text="더보기" />
        <p>archivement information goes here.</p>
      </div>
    </div>
  );
}

export default ArchivementBox;
