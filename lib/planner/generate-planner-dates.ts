export type RepeatType =
  | "NONE"
  | "DAILY"
  | "ALTERNATE"
  | "EVERY_THREE_DAYS"
  | "CUSTOM";

interface GeneratePlannerDatesOptions {
  startDate: Date;
  repeatType: RepeatType;
  repeatWeekdays: string[];
}

function getEndOfWeek(date: Date): Date {
  const end = new Date(date);

  // Sunday = 0 ... Saturday = 6
  const daysUntilSunday = 7 - end.getDay() - 1;

  end.setDate(end.getDate() + daysUntilSunday);
  end.setHours(23, 59, 59, 999);

  return end;
}

function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

const WEEKDAY_MAP: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export function generatePlannerDates(
  options: GeneratePlannerDatesOptions
): Date[] {
  const {
    startDate,
    repeatType,
    repeatWeekdays,
  } = options;

  const endOfWeek = getEndOfWeek(startDate);

  switch (repeatType) {
    case "NONE":
      return [cloneDate(startDate)];

    case "DAILY": {
      const dates: Date[] = [];
      const current = cloneDate(startDate);

      while (current <= endOfWeek) {
        dates.push(cloneDate(current));
        current.setDate(current.getDate() + 1);
      }

      return dates;
    }

    case "ALTERNATE": {
      const dates: Date[] = [];
      const current = cloneDate(startDate);

      while (current <= endOfWeek) {
        dates.push(cloneDate(current));
        current.setDate(current.getDate() + 2);
      }

      return dates;
    }

    case "EVERY_THREE_DAYS": {
      const dates: Date[] = [];
      const current = cloneDate(startDate);

      while (current <= endOfWeek) {
        dates.push(cloneDate(current));
        current.setDate(current.getDate() + 3);
      }

      return dates;
    }

    case "CUSTOM": {
      const dates: Date[] = [];
      const selectedDays = new Set(
        repeatWeekdays.map((day) => WEEKDAY_MAP[day]).filter((day) => day !== undefined)
      );
      const current = cloneDate(startDate);

      while (current <= endOfWeek) {
        if (selectedDays.has(current.getDay())) {
          dates.push(cloneDate(current));
        }
        current.setDate(current.getDate() + 1);
      }

      return dates;
    }

    default:
      return [cloneDate(startDate)];
  }
}