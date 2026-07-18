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
  occurrences?: number;
}

function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

/**
 * Calculates the final microsecond of the current week (Sunday).
 * Used to isolate recurring task generation boundaries.
 */
function getEndOfWeek(date: Date): Date {
  const end = cloneDate(date);

  // Sunday = 0 ... Saturday = 6
  const daysUntilSunday = 7 - end.getDay() - 1;

  end.setDate(end.getDate() + daysUntilSunday);
  end.setHours(23, 59, 59, 999);

  return end;
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

// Protect server memory and database from overflow/infinite loops
const MAX_OCCURRENCES = 30;

export function generatePlannerDates(
  options: GeneratePlannerDatesOptions
): Date[] {
  const {
    startDate,
    repeatType,
    repeatWeekdays,
    occurrences,
  } = options;

  const endOfWeek = getEndOfWeek(startDate);
  
  // Constrain occurrences to the UI max boundary if provided
  const safeOccurrences = occurrences !== undefined 
    ? Math.min(occurrences, MAX_OCCURRENCES) 
    : undefined;

  const shouldStop = (dates: Date[], current: Date) => {
    if (safeOccurrences !== undefined) {
      return dates.length >= safeOccurrences;
    }
    return current > endOfWeek;
  };

  switch (repeatType) {
    case "NONE":
      return [cloneDate(startDate)];

    case "DAILY": {
      const dates: Date[] = [];
      const current = cloneDate(startDate);

      while (!shouldStop(dates, current)) {
        dates.push(cloneDate(current));
        current.setDate(current.getDate() + 1);
      }

      return dates;
    }

    case "ALTERNATE": {
      const dates: Date[] = [];
      const current = cloneDate(startDate);

      while (!shouldStop(dates, current)) {
        dates.push(cloneDate(current));
        current.setDate(current.getDate() + 2);
      }

      return dates;
    }

    case "EVERY_THREE_DAYS": {
      const dates: Date[] = [];
      const current = cloneDate(startDate);

      while (!shouldStop(dates, current)) {
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

      // Guard check: Avoid infinite loop if occurrences are requested but no weekdays are matched
      if (safeOccurrences !== undefined && selectedDays.size === 0) {
        return [];
      }

      while (!shouldStop(dates, current)) {
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