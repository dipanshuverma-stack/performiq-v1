export function getWeekStart(date = new Date()) {
  const d = new Date(date);

  const day = d.getDay();

  // Monday = first reward day
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);

  d.setHours(0, 0, 0, 0);

  return d;
}

export function isRewardDay(date = new Date()) {
  const day = date.getDay();

  return day >= 1 && day <= 6;
}

export function isSunday(date = new Date()) {
  return date.getDay() === 0;
}