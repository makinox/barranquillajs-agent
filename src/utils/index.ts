import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...args: Array<ClassValue>) => twMerge(clsx(args));
