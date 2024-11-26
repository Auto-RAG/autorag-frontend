import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500";
    case "in_progress":
      return "text-blue-500";
    case "failed":
      return "text-red-500";
    case "terminated":
      return "text-orange-500";
    case "not_started":
      return "text-gray-400";
    default:
      return "text-gray-500";
  }
};

export function formatLocalTime(utcTimeStr: string) {
  const date = new Date(utcTimeStr);

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });
}
