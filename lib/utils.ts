import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally joins Tailwind CSS classes and handles merge conflicts.
 * Used heavily by UI components to allow seamless class overriding.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a maximum of 2 capitalized initials from a given full name.
 * Useful for user avatars and profile badges.
 */
export function getInitials(name: string): string {
  if (!name) return "";
  
  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}