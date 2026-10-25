import type { Answers } from "./catalog";

/**
 * Verified Par2Play facts for the public site.
 * Prices are tax-inclusive. Unknown figures stay null and render as TBD.
 */

export const NAP = {
  name: "Par2Play",
  street: "695 Hamilton Street, Suite G",
  city: "Somerset",
  region: "NJ",
  postalCode: "08873",
  country: "US",
  phoneDisplay: "(732) 448-2769",
  phoneTel: "tel:+17324482769",
  phoneE164: "+1-732-448-2769",
  founder: "Atul Kakar",
} as const;

export const ADDRESS_LINE = `${NAP.street}, ${NAP.city}, ${NAP.region} ${NAP.postalCode}`;

/** GitHub Pages origin for this repo. Used by canonical, Open Graph, and the sitemap. */
export const SITE_URL = "https://funchandan.github.io/par2play-demo/";

export const COACHES = [
  { id: "nick", name: "Nick" },
  { id: "sean", name: "Sean" },
] as const;

export const COACH_LINE = "Nick and Sean, PGA professionals";

/**
 * TODO(hours): Opening hours conflict between sources, including the door
 * decal in the storefront footage. Do not publish a schedule until confirmed.
 * Null on purpose so JSON-LD and the page cannot invent a timetable.
 */
export const OPENING_HOURS: string | null = null;

export const HOURS_PLACEHOLDER = "Hours: TODO — not published until the schedule is confirmed.";

/** Demand windows. Not a price split, and not a published hours table. */
export const BAY_WINDOWS = {
  offPeak: "Midday is off-peak, and the easier time to get a bay.",
  onPeak: "Evenings, after about 4–5pm, are on-peak. Book those ahead.",
} as const;

export const PRICES = {
  taxIncluded: true,
  /**
   * No multi-session bay pack. Checked https://par2play.com/bay-rental/
   * on 2026-10-25: it does not list 10 sessions for $400.
   */
  baySession: 70,
  unlimitedMonthly: 200,
  swingEvaluationMinutes: 50,
  swingEvaluation: 100,
  /** TODO(pricing): single 30-minute lesson price was not in the repo or the strategy sheet. */
  lessonSingle: null as number | null,
  lessonMinutes: 30,
  lessonPack3Count: 3,
  lessonPack3: 240,
  /** TODO(pricing): 5, 10, and 20 lesson-pack prices are unconfirmed (open item: about $400–$3,000). */
  lessonPack5: null as number | null,
  lessonPack10: null as number | null,
  lessonPack20: null as number | null,
  /** One weekly 1:1 lesson plus supervised unlimited access. The only junior tier. */
  juniorOneLessonWeekly: 249,
  swingLabMember: 40,
  /**
   * TODO(pricing): confirm the non-member swing lab price.
   * Campaign copy and the video guidelines both say $100.
   */
  swingLabGuest: 100,
} as const;

export type BookingOffer =
  | "bay"
  | "lesson"
  | "swing-evaluation"
  | "swing-lab"
  | "junior";

/**
 * TODO(golfclock): Paste the live URLs. They are not in this repo — the
 * strategy sheet still says "[GolfClock … link]".
 *
 * Booking is one GolfClock calendar. `bookingHref` adds `offer` so bay,
 * lesson, swing evaluation, swing lab, and junior share it.
 * Confirm GolfClock's real filter parameter name before relying on `offer`.
 * Membership checkout is a separate GolfClock URL.
 */
export const GOLF_CLOCK = {
  bookingUrl: "",
  membershipUrl: "",
} as const;

export function golfClockBookingReady(): boolean {
  return GOLF_CLOCK.bookingUrl.trim().length > 0;
}

export function golfClockMembershipReady(): boolean {
  return GOLF_CLOCK.membershipUrl.trim().length > 0;
}

export function bookingHref(offer: BookingOffer): string {
  const base = GOLF_CLOCK.bookingUrl.trim();
  if (!base) return NAP.phoneTel;
  const url = new URL(base);
  url.searchParams.set("offer", offer);
  return url.toString();
}

export function membershipHref(): string {
  const base = GOLF_CLOCK.membershipUrl.trim();
  if (!base) return NAP.phoneTel;
  return base;
}

export type GolfClockProfileNote = {
  answers: Answers;
  plan: string | null;
  savedAt: string;
};

let pendingProfileNote: GolfClockProfileNote | null = null;

/**
 * TODO(golfclock): Write quiz answers onto the customer's GolfClock profile.
 * No GolfClock API client exists in this repo. The latest note is kept in
 * memory so a future client can post it with the booking. Nothing is sent.
 */
export function saveQuizToGolfClock(note: Omit<GolfClockProfileNote, "savedAt">): void {
  pendingProfileNote = { ...note, savedAt: new Date().toISOString() };
}

export function peekGolfClockProfileNote(): GolfClockProfileNote | null {
  return pendingProfileNote;
}
