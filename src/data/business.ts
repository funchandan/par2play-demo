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
export const SITE_URL = "https://lumenhaus-hq.github.io/par2play-demo/";

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
   * 60-minute bay rental. Live GolfClock rule `rule_bay_rental` is 7000 cents
   * per resource hour on flow_bf_bay_rental. That flow offers 30, 60, 120, and
   * 180 minute variants; 30-minute slots show $35. par2play.com says "as low as
   * $40", which does not match those slots, so the calculator uses this rate.
   */
  baySession: 70,
  /**
   * TODO(pricing): Atul confirmed a 10-pack exists. No confirmed price is in
   * the repo. Do not publish a dollar amount for it.
   */
  /** Confirmed: 10 x 60-minute sessions. */
  tenPack: 400,
  unlimitedMonthly: 200,
  swingEvaluationMinutes: 50,
  swingEvaluation: 100,
  /** TODO(pricing): single 30-minute lesson with Nick or Sean. Not in the repo or the strategy sheet. */
  lessonSingle: null as number | null,
  lessonMinutes: 30,
  lessonPack3Count: 3,
  lessonPack3: 240,
  /** Confirmed pack ends. 10, 20, and 30 are not listed on par2play.com, so the page shows $TBD. */
  lessonPack5: 400,
  /** TODO(pricing): 10-lesson pack. Not listed on par2play.com. */
  lessonPack10: null as number | null,
  /** TODO(pricing): 20-lesson pack. Not listed on par2play.com. */
  lessonPack20: null as number | null,
  /** TODO(pricing): 30-lesson pack. Not listed on par2play.com. */
  lessonPack30: null as number | null,
  lessonPack50: 3000,
  /** TODO(pricing): club fitting. par2play.com does not publish a fitting price. */
  fitting: null as number | null,
  /** Lessons, assessments, practice time, and a workshop. */
  golfImprovementBundle: 599,
  /** Once-a-week 1:1 lesson plus unlimited facility access. */
  juniorOneLessonWeekly: 249,
  /** Twice-a-week lessons plus unlimited facility access. */
  juniorTwoLessonsWeekly: 399,
  swingLabMember: 40,
  /**
   * TODO(pricing): confirm the non-member swing lab price.
   * Campaign copy and the video guidelines both say $100.
   */
  swingLabGuest: 100,
  /** TODO(pricing): event package. par2play.com/events does not publish a price list. */
  eventPackage: null as number | null,
  /** TODO(pricing): fall league entry. The league page does not publish a fee. */
  leagueEntry: null as number | null,
} as const;

export type BookingOffer =
  | "bay"
  | "ten-pack"
  | "lesson"
  | "swing-evaluation"
  | "swing-lab"
  | "fitting"
  | "group"
  | "junior"
  | "junior-plus"
  | "tournament";

/** Live GolfClock / oclock destinations. These replace the old phone fallback. */
export const OCLOCK = {
  bayRental: "https://par2play.oclock.app/book?flow=flow_bf_bay_rental",
  lessons: "https://par2play.oclock.app/book?flow=flow_bf_lessons",
  fitting: "https://par2play.oclock.app/book?flow=flow_bf_fitting",
  league: "https://par2play.oclock.app/book?flow=flow_bf_league",
  practiceUnlimited: "https://par2play.oclock.app/store/prod_practice_unlimited",
  /** Public membership carousel. Per-tier GolfClock products are not in the store yet. */
  liveMembership: "https://par2play.com/membership",
  tenPracticePack: "https://par2play.oclock.app/store/prod_10_practice_pack",
  lessonPacks: "https://par2play.oclock.app/store/prod_lesson_packs",
  golfImprovementBundle: "https://par2play.oclock.app/store/prod_golf_improvement_bundle",
  book: "https://par2play.oclock.app/book",
  store: "https://par2play.oclock.app/store",
  memberships: "https://par2play.oclock.app/store?category=Memberships",
  seriesPackages: "https://par2play.oclock.app/store?category=Series+Packages",
  events: "https://par2play.oclock.app/events",
} as const;

export const GOLF_CLOCK = {
  bookingUrl: OCLOCK.book,
  membershipUrl: OCLOCK.practiceUnlimited,
} as const;

export function golfClockBookingReady(): boolean {
  return GOLF_CLOCK.bookingUrl.trim().length > 0;
}

export function golfClockMembershipReady(): boolean {
  return GOLF_CLOCK.membershipUrl.trim().length > 0;
}

export function bookingHref(offer: BookingOffer): string {
  switch (offer) {
    case "bay":
      return OCLOCK.bayRental;
    case "ten-pack":
      return OCLOCK.tenPracticePack;
    case "lesson":
    case "swing-evaluation":
    case "swing-lab":
    case "junior":
    case "junior-plus":
      return OCLOCK.lessons;
    case "fitting":
      return OCLOCK.fitting;
    case "group":
      return OCLOCK.events;
    case "tournament":
      return OCLOCK.league;
    default: {
      const exhaustive: never = offer;
      return exhaustive;
    }
  }
}

export function membershipHref(): string {
  return OCLOCK.practiceUnlimited;
}

/**
 * TODO(enquiry): Paste a Formspree-style POST URL. Empty sends nothing.
 * TODO(enquiry): Paste the mailto inbox. Empty has no mail fallback.
 */
export const ENQUIRY = {
  endpoint: "",
  email: "",
} as const;

export type EnquiryInterest = "bays" | "membership" | "lessons" | "junior" | "events" | "tournament";

export const ENQUIRY_INTERESTS: { id: EnquiryInterest; label: string }[] = [
  { id: "bays", label: "Bays" },
  { id: "membership", label: "Membership" },
  { id: "lessons", label: "Lessons" },
  { id: "junior", label: "Junior" },
  { id: "events", label: "Events" },
  { id: "tournament", label: "Tournament" },
];

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
