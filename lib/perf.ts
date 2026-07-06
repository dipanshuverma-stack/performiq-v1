// lib/perf.ts

/**
 * Starts a high-resolution timer isolated to the current execution context.
 */
export function startTimer(): number {
  return performance.now();
}

/**
 * Logs the elapsed time for a given label since the start timer was captured.
 */
export function endTimer(name: string, start: number): void {
  console.log(
    `${name}: ${(performance.now() - start).toFixed(2)} ms`
  );
}