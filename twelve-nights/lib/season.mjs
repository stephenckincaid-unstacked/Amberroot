// season.mjs
// -----------------------------------------------------------------------------
// The spine of the Twelve Nights system (plan Part B1).
//
// Two rules, and nothing else is stored:
//   1. No literal dates live in content or code. Every observance is pinned to a
//      fixed point in the calendar (Ember Night is always Dec 15, the First
//      Night is always Dec 25, Epiphany is always Jan 6). Only the month and day
//      are declared below.
//   2. The season year is DERIVED, never stored:
//          season_year = (month is January) ? current_year - 1 : current_year
//      so the January nights (Jan 1 to Jan 6) belong to the December that began
//      the season. There is no annual maintenance step. This is not configured
//      for 2026; it is configured for December.
//
// Everything operates on "civil dates" ({ y, m, d } integers in one time zone),
// never on raw Date objects, so there are no timezone-drift surprises and the
// whole module is trivially testable by passing a civil date in.
// -----------------------------------------------------------------------------

// The fourteen observances, in order. month/day are the only dates that exist.
// kind drives presentation; n is the night number for the Twelve Nights.
export const OBSERVANCES = [
  { id: "ember",    kind: "ember",    label: "Ember Night",   month: 12, day: 15 },
  { id: "night-01", kind: "night", n: 1,  label: "The First Night",    month: 12, day: 25 },
  { id: "night-02", kind: "night", n: 2,  label: "The Second Night",   month: 12, day: 26 },
  { id: "night-03", kind: "night", n: 3,  label: "The Third Night",    month: 12, day: 27 },
  { id: "night-04", kind: "night", n: 4,  label: "The Fourth Night",   month: 12, day: 28 },
  { id: "night-05", kind: "night", n: 5,  label: "The Fifth Night",    month: 12, day: 29 },
  { id: "night-06", kind: "night", n: 6,  label: "The Sixth Night",    month: 12, day: 30 },
  { id: "night-07", kind: "night", n: 7,  label: "The Seventh Night",  month: 12, day: 31 },
  { id: "night-08", kind: "night", n: 8,  label: "The Eighth Night",   month: 1,  day: 1 },
  { id: "night-09", kind: "night", n: 9,  label: "The Ninth Night",    month: 1,  day: 2 },
  { id: "night-10", kind: "night", n: 10, label: "The Tenth Night",    month: 1,  day: 3 },
  { id: "night-11", kind: "night", n: 11, label: "The Eleventh Night", month: 1,  day: 4 },
  { id: "night-12", kind: "night", n: 12, label: "The Twelfth Night",  month: 1,  day: 5 },
  { id: "epiphany", kind: "epiphany", label: "Epiphany",      month: 1,  day: 6 },
];

const MONTHS = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// A civil date as a single comparable integer: 2026-12-25 -> 20261225.
const ymd = (y, m, d) => y * 10000 + m * 100 + d;

// Format a civil ordinal date the way the pages speak it: "December 25".
export function speakDate(month, day) {
  return `${MONTHS[month]} ${day}`;
}

// The current civil date in the chosen zone, or an override for time travel.
// override is a plain "YYYY-MM-DD" string (what the build and tests pass in).
export function civilNow({ tz = "America/Chicago", override = null } = {}) {
  if (override) {
    const [y, m, d] = override.split("-").map(Number);
    return { y, m, d };
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

// Rule 2: derive the season year from the civil "now".
export function seasonYear(now) {
  return now.m === 1 ? now.y - 1 : now.y;
}

// The civil date an observance unlocks, for a given season year.
// December observances fall in the season year; January observances in the next.
export function unlockYmd(obs, sy) {
  const year = obs.month === 12 ? sy : sy + 1;
  return ymd(year, obs.month, obs.day);
}

// The calendar year an observance's date lands in, for a season year.
export function unlockYear(obs, sy) {
  return obs.month === 12 ? sy : sy + 1;
}

// The season is open from Nov 1 through Epiphany (Jan 6). It is SEALED from
// Jan 7 through Oct 31 (plan Part A4). Closing is what makes a season.
export function isSealed(now) {
  if (now.m === 11 || now.m === 12) return false;       // Nov, Dec: open
  if (now.m === 1 && now.d <= 6) return false;          // Jan 1 to 6: open
  return true;                                          // everything else: sealed
}

// The state of one observance relative to a civil "now":
//   "sealed" | "locked" | "open"
// plus the unlock integer and the human date, for rendering.
export function observanceState(obs, now) {
  const sy = seasonYear(now);
  const unlock = unlockYmd(obs, sy);
  const today = ymd(now.y, now.m, now.d);
  let state;
  if (isSealed(now)) state = "sealed";
  else state = today >= unlock ? "open" : "locked";
  return {
    state,
    seasonYear: sy,
    unlockYmd: unlock,
    unlockYear: unlockYear(obs, sy),
    opensOn: speakDate(obs.month, obs.day),
  };
}

// The whole season resolved at once, in order. What the build and hub consume.
export function resolveSeason(now) {
  return {
    now,
    sealed: isSealed(now),
    seasonYear: seasonYear(now),
    observances: OBSERVANCES.map((obs) => ({ ...obs, ...observanceState(obs, now) })),
  };
}
