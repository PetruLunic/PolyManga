export function timeSince(pastTime: Date): string {
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
    return years === 1 ? "1 year" : `${years} years`;
  } else if (months > 0) {
    return months === 1 ? "1 month" : `${months} months`;
  } else if (weeks > 0) {
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  } else if (days > 0) {
    return days === 1 ? "1 day" : `${days} days`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  } else {
    return seconds === 1 ? "1 second" : `${seconds} seconds`;
  }
}