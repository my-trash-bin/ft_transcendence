import Link from 'next/link';

function ArchivementBox() {
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple ' +
    'text-center text-black text-lg font-bold hover:bg-light-background  ' +
    'flex items-center justify-center ' +
    'absolute top-xl right-xl';
  return (
    <div className="w-[435px] h-[420px] bg-light-background rounded-lg relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <h2 className="text-h2 font-bold absolute top-xl left-xl">업적</h2>
        <Link href="/profile/achivement" className={buttonClass}>
          더보기
        </Link>
        <p>archivement information goes here.</p>
      </div>
    </div>
  );
}

export default ArchivementBox;
