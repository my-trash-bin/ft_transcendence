import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
  return <div className="w-[900px] h-[750px] m-auto ">{children}</div>;
}
