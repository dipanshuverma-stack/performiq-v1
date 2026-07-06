/**
 * Formats average time per question (milliseconds) into human-readable shorthand.
 */
export function formatAverageTime(elapsedMs: number, attempts: number): string {
  if (attempts === 0 || elapsedMs <= 0) return "—";

  const avgSeconds = Math.round(elapsedMs / attempts / 1000);

  if (avgSeconds < 60) {
    return `${avgSeconds}s`;
  }

  const minutes = Math.floor(avgSeconds / 60);
  const seconds = avgSeconds % 60;

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

/**
 * Formats milliseconds into clean stopwatch display (HH:MM:SS or MM:SS).
 */
export function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}