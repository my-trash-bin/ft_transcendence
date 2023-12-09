import { NavbarLayout } from '@/components/common/NavbarLayout';
import Navbar from '../../components/common/Navbar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
