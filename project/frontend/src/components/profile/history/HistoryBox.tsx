import { ProfileButton } from '../ProfileButton';

function HistoryBox() {
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg ml-[30px] relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-semibold text-dark-gray absolute top-xl left-xl">
          최근 전적
        </h2>
        <p>history information goes here.</p>
        <ProfileButton href="/profile/history" text="더보기" />
      </div>
    </div>
  );
}

export default HistoryBox;
