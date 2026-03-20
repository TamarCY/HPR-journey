export function calculatePregnancyWeek(
  gestationalAnchorDate: Date,
  now: Date = new Date(),
) {
  const msPerDay = 1000 * 60 * 60 * 24;

  const anchor = new Date(gestationalAnchorDate);
  const today = new Date(now);

  anchor.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = today.getTime() - anchor.getTime();
  const diffInDays = Math.floor(diffInMs / msPerDay);

  const week = Math.floor(diffInDays / 7) + 1;

  return Math.max(1, week);
}

export function getGreeting() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour")?.value);

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}
