// Calculates current pregnancy week from the canonical gestational anchor date.
// Uses calendar days and returns a minimum of week 1.

export function calculatePregnancyWeek(
  gestationalAnchorDate: Date,
  now: Date = new Date(),
) {
  const msPerDay = 1000 * 60 * 60 * 24;

  const anchor = new Date(gestationalAnchorDate);
  const today = new Date(now);

  // normalize both dates to midnight local time to avoid partial-day issues
  anchor.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = today.getTime() - anchor.getTime();
  const diffInDays = Math.floor(diffInMs / msPerDay);

  const week = Math.floor(diffInDays / 7) + 1;

  return Math.max(1, week);
}
