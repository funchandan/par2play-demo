/**
 * Event names and tag IDs. The PM may revise the names.
 * IDs are from the live par2play.com homepage HTML (30 Oct 2026). See live-site-evidence.
 * Only GTM-M85LSDB3 is loaded. A standalone gtag.js for GA4 would double-count,
 * because that container already holds G-W5W5LHTPF1. GTM-TBDKSXQH is not loaded.
 */
export const ANALYTICS_EVENTS = {
  membershipClick: "membership_click",
  bookBayClick: "book_bay_click",
  bookLessonClick: "book_lesson_click",
  eventAvailabilityClick: "event_availability_click",
  leagueJoinClick: "league_join_click",
  contact: "contact",
  golfclockClick: "golfclock_click",
  generateLead: "generate_lead",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Loaded inside GTM-M85LSDB3. Not loaded as its own gtag.js. */
export const GA4_MEASUREMENT_ID = "G-W5W5LHTPF1";

/** The only container this site loads. */
export const GTM_CONTAINER_ID = "GTM-M85LSDB3";

/** Present on the live theme. Not loaded here. */
export const RETIRED_GTM_CONTAINER_ID = "GTM-TBDKSXQH";

export const META_PIXEL_ID = "889189213949934";

/** Present on the live site and inside GTM. Not loaded as standalone gtag. */
export const GOOGLE_ADS_ID = "AW-11199642282";

export const SEARCH_CONSOLE_VERIFICATION = "SVSAswdfSTzqPRciWqf77ANCHuDDCbzeVF89P6ECFzM";

export const PRODUCTION_HOSTS = ["par2play.com", "www.par2play.com"] as const;
