import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
}

export function formatDateWithTime(date: string | Date): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function calculateTimeAgo(date: string | Date): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
}

export function formatCurrency(amount: number | string, currency: string = "EUR"): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getRandomAvatarUrl(name: string): string {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=1E88E5&color=fff`;
}

export function getRatingStars(rating: number): {filled: number, half: boolean, empty: number} {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
  
  return {
    filled: filledStars,
    half: hasHalfStar,
    empty: emptyStars
  };
}

export function getTravelersCount(trips: any[]): number {
  return new Set(trips.map(trip => trip.userId)).size;
}

export function getSuccessfulDeliveriesCount(deliveries: any[]): number {
  return deliveries.filter(delivery => delivery.status === 'completed').length;
}

export function getUniqueLocationCount(trips: any[]): number {
  const originCities = new Set(trips.map(trip => `${trip.originCity}, ${trip.originCountry}`));
  const destinationCities = new Set(trips.map(trip => `${trip.destinationCity}, ${trip.destinationCountry}`));
  
  const allCities = new Set([...originCities, ...destinationCities]);
  return allCities.size;
}

export function calculateAverageRating(reviews: any[]): number {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
}
