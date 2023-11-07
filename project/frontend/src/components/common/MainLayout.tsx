import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
  return <div className="max-w-[900px] max-h-[768px] m-auto ">{children}</div>;
}
