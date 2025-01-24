export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString(); // If the number is less than 1000, return it as is
  }

  const suffixes = ["", "K", "M", "B", "T"]; // Suffixes for thousand, million, billion, trillion
  const tier = Math.floor(Math.log10(num) / 3); // Determine the tier (thousand, million, etc.)

  const scaled = num / Math.pow(1000, tier); // Scale the number to the appropriate tier
  const formatted = scaled.toFixed(scaled % 1 === 0 ? 0 : 1); // Format with one decimal if needed

  return `${formatted}${suffixes[tier]}`; // Append the suffix
}
