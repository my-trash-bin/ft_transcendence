import { NavbarLayout } from '@/components/common/NavbarLayout';

export default function DmLayout({ children }: { children: React.ReactNode }) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
