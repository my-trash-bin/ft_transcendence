import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-[inherit] w-[1280px] overflow-scroll mt-0 mb-0 ml-auto mr-auto">
      {children}
    </div>
  );
}
