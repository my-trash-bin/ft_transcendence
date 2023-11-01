import { PropsWithChildren } from 'react';
import { NavBar } from '../_internal/component/ui/layout/NavBar';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
