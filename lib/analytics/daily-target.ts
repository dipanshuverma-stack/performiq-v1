export interface DailyTarget {
  topicsPerDay: number;
  revisionsPerDay: number;
  mocksPerWeek: number;
  studyMinutesPerDay: number;
}

/**
 * Calculates realistic daily targets based on remaining time and workload.
 */
export function calculateDailyTarget(
  daysRemaining: number,
  topicsRemaining: number,
  revisionsRemaining: number
): DailyTarget {
  if (daysRemaining <= 0) {
    return {
      topicsPerDay: 0,
      revisionsPerDay: 0,
      mocksPerWeek: 0,
      studyMinutesPerDay: 0,
    };
  }

  return {
    topicsPerDay: Math.round((topicsRemaining / daysRemaining) * 10) / 10,

    revisionsPerDay: Math.round((revisionsRemaining / daysRemaining) * 10) / 10,

    mocksPerWeek: Math.max(1, Math.ceil(daysRemaining / 30)),

    studyMinutesPerDay: Math.max(
      60,
      Math.ceil((topicsRemaining * 30) / daysRemaining)
    ),
  };
}