import { ReactNode } from 'react';

export function MainLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className="w-[900px] h-[750px] m-auto font-sejong">{children}</div>
  );
}
