export interface PlannerDay {
  label: string;
  date: Date;
  isToday: boolean;
}

const DAY_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function getPlannerWeek(): PlannerDay[] {
  const today = new Date();

  const days: PlannerDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    days.push({
      label: i === 0 ? "Today" : DAY_NAMES[date.getDay()],
      date,
      isToday: i === 0,
    });
  }

  return days;
}