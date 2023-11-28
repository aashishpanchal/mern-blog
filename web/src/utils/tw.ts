import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
