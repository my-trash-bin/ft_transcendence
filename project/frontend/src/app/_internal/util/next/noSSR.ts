import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export function noSSR<T>(component: ComponentType<T>): ComponentType<T> {
  return dynamic(() => Promise.resolve(component), { ssr: false });
}
