export function calculateScore(
  correct: number,
  wrong: number
) {
  return correct - wrong * 0.25;
}

export function calculateAccuracy(
  correct: number,
  wrong: number
) {
  const attempted =
    correct + wrong;

  if (attempted === 0)
    return 0;

  return Math.round(
    (correct / attempted) * 100
  );
}