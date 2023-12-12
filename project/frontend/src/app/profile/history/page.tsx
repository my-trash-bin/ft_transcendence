'use client';
import withAuth from '@/components/auth/withAuth';
import { HistoryArticle } from '../../../components/profile/history/HistoryArticle';

function HistoryPage() {
  return (
    <div className="w-[100%] h-[100%] bg-light-background rounded-lg">
      <HistoryArticle />
    </div>
  );
}

export default withAuth(HistoryPage, 'history');
