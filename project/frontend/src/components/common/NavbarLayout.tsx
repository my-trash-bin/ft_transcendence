import { ReactNode } from 'react';
import Navbar from './Navbar';

export function NavbarLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className="flex flex-row w-[inherit] h-[inherit]">
      <Navbar />
      <div className="w-[900px] h-[750px] m-auto font-sejong">{children}</div>
    </div>
  );
}
