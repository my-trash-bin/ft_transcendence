import toast, { Toaster } from 'react-hot-toast';

function HistoryArticle() {
  const history = () => toast(`전적 상세`);
  return (
    <div className="w-[600px] h-xl bg-light-background border-5 border-dark-purple mt-xl ml-xl">
      <Toaster />
      <div className="mt-lg ml-lg">
        <h2 className="text-h2 font-bold">최근 전적</h2>
        <p>history information goes here.</p>
        <button onClick={history}>View history Details</button>
      </div>
    </div>
  );
}

export default HistoryArticle;
