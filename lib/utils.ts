/**
 * Format a number to display with a maximum of 2 decimal places
 * Removes trailing zeros for cleaner display
 */
export function formatNumber(num: number): string {
  // Round to 2 decimal places to avoid floating point precision issues
  const rounded = Math.round(num * 100) / 100;
  // Format to 2 decimal places and remove trailing zeros
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Format a percentage (0-1 scale) to display with max 2 decimal places
 */
export function formatPercentage(value: number): string {
  return formatNumber(value * 100);
}

/**
 * Format a percentage that's already in 0-100 scale
 */
export function formatPercentageValue(value: number): string {
  return formatNumber(value);
}

