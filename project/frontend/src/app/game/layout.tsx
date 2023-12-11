import { NavbarLayout } from '@/components/common/NavbarLayout';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
