import type { Difficulty } from "@/types";

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    if (Number.isNaN(date.getTime())) return dateString;
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) {
      const futureSeconds = Math.abs(diffInSeconds);
      if (futureSeconds < 60) return "in under a minute";
      if (futureSeconds < 3600) return `in ${Math.floor(futureSeconds / 60)}m`;
      if (futureSeconds < 86400) return `in ${Math.floor(futureSeconds / 3600)}h`;
      if (futureSeconds < 2592000) return `in ${Math.floor(futureSeconds / 86400)}d`;
      if (futureSeconds < 31536000) return `in ${Math.floor(futureSeconds / 2592000)}mo`;
      return `in ${Math.floor(futureSeconds / 31536000)}y`;
    }

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  } catch {
    return dateString;
  }
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}

export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000) return `${Math.floor(num / 1000)}K`;
  if (num < 10000000) return `${(num / 1000000).toFixed(1)}M`;
  return `${Math.floor(num / 1000000)}M`;
}

export function formatAuthors(authors: { name: string }[]): string {
  if (!authors || authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
  return `${authors[0].name} et al.`;
}

export function formatDifficulty(difficulty: Difficulty): string {
  return {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }[difficulty];
}
