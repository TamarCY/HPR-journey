function getBostonDateTimeParts(date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value;

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: get("weekday"), // Mon / Tue / Wed / Thu / Fri / Sat / Sun
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

function getBostonDateOnly(date: Date = new Date()) {
  const { year, month, day } = getBostonDateTimeParts(date);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function getMostRecentFriday6pmBoundary(date: Date = new Date()) {
  const parts = getBostonDateTimeParts(date);

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
  const friday = 5;

  let daysSinceFriday = currentWeekday - friday;
  if (daysSinceFriday < 0) {
    daysSinceFriday += 7;
  }

  const bostonDateOnly = getBostonDateOnly(date);
  const boundary = new Date(bostonDateOnly);
  boundary.setUTCDate(boundary.getUTCDate() - daysSinceFriday);

  const isBeforeFriday6pm =
    currentWeekday === friday &&
    (parts.hour < 18 || (parts.hour === 18 && parts.minute === 0 ? false : false));

  if (currentWeekday === friday && parts.hour < 18) {
    boundary.setUTCDate(boundary.getUTCDate() - 7);
  }

  // boundary is "Friday date" in Boston terms represented safely as a UTC midday date
  return boundary;
}

export function calculateStudyWeek(studyStartedAt: Date, now: Date = new Date()) {
  const startBoundary = getMostRecentFriday6pmBoundary(studyStartedAt);
  const currentBoundary = getMostRecentFriday6pmBoundary(now);

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const diffMs = currentBoundary.getTime() - startBoundary.getTime();
  const diffWeeks = Math.floor(diffMs / msPerWeek);

  return Math.max(1, diffWeeks + 1);
}
