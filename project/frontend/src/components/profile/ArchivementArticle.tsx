import toast, { Toaster } from 'react-hot-toast';

function ArchivementArticle() {
  const achivement = () => toast(`업적 상세`);
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple text-center text-black text-lg font-bold hover:bg-light-background ' +
    'absolute top-xl right-xl';
  return (
    <div className="w-[600px] h-xl bg-light-background rounded-lg mt-xl ml-xl relative">
      <div className="h-[inherit] pt-3xl flex flex-col items-center">
        <Toaster />
        <h2 className="text-h2 font-bold absolute top-xl left-xl">업적</h2>
        <p>archivement information goes here.</p>
        <button onClick={achivement} className={buttonClass}>
          더보기
        </button>
      </div>
    </div>
  );
}

export default ArchivementArticle;
