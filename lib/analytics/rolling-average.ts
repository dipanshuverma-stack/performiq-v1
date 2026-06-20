export function calculateRollingAverage(
  values: number[],
  window = 3
): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - window + 1);

    const slice = values.slice(start, index + 1);

    const average =
      slice.reduce((sum, value) => sum + value, 0) /
      slice.length;

    return Math.round(average * 10) / 10;
  });
}