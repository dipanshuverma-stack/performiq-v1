const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getOverdueDays(
  plannedDate: Date | string
): number {
  const today = startOfDay(new Date());

  const planned = startOfDay(
    plannedDate instanceof Date
      ? plannedDate
      : new Date(plannedDate)
  );

  const diff = Math.floor(
    (today.getTime() - planned.getTime()) / MS_PER_DAY
  );

  return Math.max(0, diff);
}

export function isOverdue(
  plannedDate: Date | string
): boolean {
  return getOverdueDays(plannedDate) > 0;
}