import toast, { Toaster } from 'react-hot-toast';

function ArchivementArticle() {
  const achivement = () => toast(`업적 상세`);
  return (
    <div className="w-[600px] h-xl bg-light-background border-5 border-dark-purple mt-xl ml-xl">
      <Toaster />
      <div className="mt-lg ml-lg">
        <h2 className="text-h2 font-bold">업적</h2>
        <p>archivement information goes here.</p>
        <button onClick={achivement}>View archivement Details</button>
      </div>
    </div>
  );
}

export default ArchivementArticle;
