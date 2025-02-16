import {useTranslations} from "next-intl";

export function useTimeSince(pastTime: Date): string {
  const t = useTranslations("common.ui.timeSince");

  const now = new Date();
  const diffInMs = now.getTime() - pastTime.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Approximation: 1 month = 30.44 days
  const years = Math.floor(days / 365.25); // Approximation: 1 year = 365.25 days

  if (years > 0) {
    return t("year", {count: years})
  } else if (months > 0) {
    return t("month", {count: months})
  } else if (weeks > 0) {
    return t("week", {count: weeks})
  } else if (days > 0) {
    return t("days", {count: days})
  } else if (hours > 0) {
    return t("hour", {count: hours})
  } else if (minutes > 0) {
    return t("minute", {count: minutes})
  } else {
    return t("second", {count: seconds})
  }
}