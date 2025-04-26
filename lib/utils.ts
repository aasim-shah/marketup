import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMockApiKey(): string {
  return "AIzaSyD2s1mzBTHHi-MTdixGm0CpgJbADw" + Math.random().toString(36).substring(2, 10);
}