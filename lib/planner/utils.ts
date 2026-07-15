import { RepeatType, PlannerDay } from "./types";

export function formatDateKey(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getPlannerDays(): PlannerDay[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    let label = date.toLocaleDateString("en-GB", { weekday: "short" });
    if (index === 0) label = "Today";
    if (index === 1) label = "Tomorrow";
    return { label, date, isToday: index === 0 };
  });
}

/**
 * Shared engine logic to project dynamic dates.
 * Kept basic for preview rendering placeholder until backend strategy merges.
 */
export function generateRepeatPreview(baseDate: Date, repeatType: RepeatType, repeatWeekdays: string[]): Date[] {
  if (repeatType === "NONE") return [];
  const dates: Date[] = [];
  
  for (let i = 0; i < 30; i++) {
    const futureDate = new Date(baseDate);
    futureDate.setDate(baseDate.getDate() + i);
    
    if (repeatType === "DAILY") {
      dates.push(futureDate);
    } else if (repeatType === "ALTERNATE" && i % 2 === 0) {
      dates.push(futureDate);
    } else if (repeatType === "EVERY_THREE_DAYS" && i % 3 === 0) {
      dates.push(futureDate);
    } else if (repeatType === "CUSTOM") {
      const dayStr = futureDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      if (repeatWeekdays.includes(dayStr)) {
        dates.push(futureDate);
      }
    }
  }
  return dates.slice(0, 5);
}