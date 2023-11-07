import { MainLayout } from '@/components/common/MainLayout';
import Navbar from '../../components/common/navbar';

export default function DmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-[inherit] max-h-[768px]">
      <Navbar />
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
