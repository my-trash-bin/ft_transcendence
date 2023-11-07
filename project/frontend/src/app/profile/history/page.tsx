'use client';
import Navbar from '../../../components/common/Navbar';
import HistoryArticle from '../../../components/profile/history/HistoryArticle';

export default function HistoryPage() {
  return (
    <div className="flex flex-row w-[100%] h-[100%]">
      <Navbar />
      <div className="w-[100%]">
        <div className="flex flex-col items-center">
          <div className="flex flex-row">
            <HistoryArticle />
          </div>
        </div>
      </div>
    </div>
  );
}
