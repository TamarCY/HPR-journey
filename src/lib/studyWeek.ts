function getBostonParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value;

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const weekday = get("weekday");
  const hour = get("hour");
  const minute = get("minute");

  if (!year || !month || !day || !weekday || !hour || !minute) {
    throw new Error("Failed to calculate Boston date parts");
  }

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    weekday,
    hour: Number(hour),
    minute: Number(minute),
  };
}

function getMostRecentFridayBoundary(date: Date = new Date()) {
  const parts = getBostonParts(date);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const currentWeekday = weekdayMap[parts.weekday];

  if (currentWeekday === undefined) {
    throw new Error(`Unsupported weekday: ${parts.weekday}`);
  }

  const friday = 5;

  let daysSinceFriday = currentWeekday - friday;
  if (daysSinceFriday < 0) {
    daysSinceFriday += 7;
  }

  const base = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0));
  base.setUTCDate(base.getUTCDate() - daysSinceFriday);

  if (currentWeekday === friday && parts.hour < 18) {
    base.setUTCDate(base.getUTCDate() - 7);
  }

  return base;
}

export function calculateStudyWeek(studyStartedAt: Date, now: Date = new Date()) {
  const startBoundary = getMostRecentFridayBoundary(studyStartedAt);
  const currentBoundary = getMostRecentFridayBoundary(now);

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const diffWeeks = Math.floor(
    (currentBoundary.getTime() - startBoundary.getTime()) / msPerWeek,
  );

  return Math.max(1, diffWeeks + 1);
}
