export function getPracticeRewardPoints(durationSeconds: number): number {
  const minutes = durationSeconds / 60;

  if (minutes >= 90) return 35;
  if (minutes >= 60) return 25;
  if (minutes >= 45) return 20;
  if (minutes >= 30) return 15;
  if (minutes >= 20) return 10;
  if (minutes >= 10) return 5;
  if (minutes >= 5) return 2;

  return 0;
}