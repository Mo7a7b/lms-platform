import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string): string {
  return `$${Number(price).toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export function capitalizeFirstLetter(text: string): string {
  if (text.length === 0) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number,
): number {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
}

export function formatDuration(duration: number) {
  // duration is given in minutes
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (hours !== 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${duration}m`;
  }
}
