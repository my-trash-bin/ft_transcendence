import { NavbarLayout } from '@/components/common/NavbarLayout';
import Navbar from '../../components/common/Navbar';

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
