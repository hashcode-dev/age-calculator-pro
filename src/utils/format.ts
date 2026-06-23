export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatLarge(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
