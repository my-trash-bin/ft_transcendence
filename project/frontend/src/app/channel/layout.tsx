import { NavbarLayout } from '@/components/common/NavbarLayout';

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
