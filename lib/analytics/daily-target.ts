export interface DailyTarget {
  topicsPerDay: number;
  revisionsPerDay: number;
  mocksPerWeek: number;
  studyMinutesPerDay: number;
}

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
    topicsPerDay: Number(
      (topicsRemaining / daysRemaining).toFixed(1)
    ),

    revisionsPerDay: Number(
      (revisionsRemaining / daysRemaining).toFixed(1)
    ),

    mocksPerWeek: Math.max(
      1,
      Math.ceil(daysRemaining / 30)
    ),

    studyMinutesPerDay: Math.max(
      60,
      Math.ceil(
        (topicsRemaining * 30) / daysRemaining
      )
    ),
  };
}