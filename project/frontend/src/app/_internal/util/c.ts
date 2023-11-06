import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function c(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
