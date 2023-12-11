import { NavbarLayout } from '@/components/common/NavbarLayout';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
