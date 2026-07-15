export function getPlannerToday() {
  const now = new Date();

  // Study day changes at 3 AM
  if (now.getHours() < 3) {
    now.setDate(now.getDate() - 1);
  }

  now.setHours(0, 0, 0, 0);

  return now;
}