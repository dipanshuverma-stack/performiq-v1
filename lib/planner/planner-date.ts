const STUDY_DAY_START_HOUR = 3;

export function getPlannerToday() {
  const now = new Date();

  if (now.getHours() < STUDY_DAY_START_HOUR) {
    now.setDate(now.getDate() - 1);
  }

  // Set to 3 AM to avoid midnight-based local/UTC environment shifts
  now.setHours(3, 0, 0, 0);

  return now;
}

export function parsePlannerDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);

  // Create the planner day at 3 AM local time instead of midnight.
  return new Date(year, month - 1, day, 3, 0, 0, 0);
}

export function normalizePlannerDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(3, 0, 0, 0);
  return normalized;
}

export function getPlannerTomorrow() {
  const tomorrow = new Date(getPlannerToday());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export function plannerDateKey(date: Date) {
  const d = normalizePlannerDate(date);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}