// Import utility functions from clsx and tailwind-merge
import { clsx, type ClassValue } from "clsx" // Utility for constructing className strings conditionally
import { twMerge } from "tailwind-merge" // Utility for merging Tailwind CSS classes

/**
 * Utility function to merge and deduplicate Tailwind CSS classes
 * 
 * This function combines clsx (for conditional classes) and tailwind-merge
 * (for deduplicating Tailwind classes) to create a powerful className utility.
 * 
 * Example usage:
 * cn("px-2 py-1", condition && "bg-blue-500", "px-4") 
 * // Result: "py-1 bg-blue-500 px-4" (px-2 is overridden by px-4)
 * 
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
