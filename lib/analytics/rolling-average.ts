/**
 * Calculates rolling average with a given window size.
 * Optimized for performance using sliding window technique.
 */
export function calculateRollingAverage(
  values: number[],
  window = 3
): number[] {
  if (values.length === 0) return [];

  const result: number[] = [];
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i];

    // Remove element that is no longer in the window
    if (i >= window) {
      sum -= values[i - window];
    }

    const currentWindowSize = Math.min(i + 1, window);
    const average = sum / currentWindowSize;

    result.push(Math.round(average * 10) / 10);
  }

  return result;
}