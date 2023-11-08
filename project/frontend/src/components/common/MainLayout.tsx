import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
  return <div className="w-[900px] max-h-[inherit] m-auto ">{children}</div>;
}
