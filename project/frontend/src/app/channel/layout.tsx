import { MainLayout } from '@/components/common/MainLayout';
import Navbar from '../../components/common/Navbar';

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row w-[inherit]">
      <Navbar />
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
