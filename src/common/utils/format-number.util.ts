/**
 * Format number with commas
 * @param num - The number to format
 * @returns Formatted string with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Parse formatted number string back to number
 * @param str - The formatted string (e.g., "1,000,000")
 * @returns The number value
 */
export function parseFormattedNumber(str: string): number {
  // Remove all non-digit characters except decimal point and minus sign
  const cleanStr = str.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
}

/**
 * Format input value as user types
 * @param value - The input value
 * @returns Formatted string for display
 */
export function formatInputNumber(value: string | number): string {
  if (typeof value === 'string') {
    // Remove all non-digit characters first
    const cleanValue = value.replace(/[^\d.-]/g, '');
    if (cleanValue === '' || cleanValue === '-') return cleanValue;

    const num = parseFloat(cleanValue);
    return isNaN(num) ? '' : formatNumber(num);
  }
  return formatNumber(value);
}