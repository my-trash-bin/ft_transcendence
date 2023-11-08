import { MainLayout } from '@/components/common/MainLayout';
import Navbar from '../../components/common/Navbar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row w-[inherit] h-[100%]">
      <Navbar />
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
