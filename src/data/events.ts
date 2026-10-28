/**
 * Facts taken from https://par2play.com/events/ and https://par2play.com/holiday-party/.
 * Do not add packages, prices, or venues that those pages do not state.
 */
export const EVENT_TYPES = [
  "Holiday parties",
  "Small groups",
  "Large groups",
  "Kids and teens birthday parties",
  "Company events",
  "Tournaments and fundraisers",
  "Team building",
] as const;

export const EVENT_FACTS = [
  "Four enclosed bays with comfortable seating and HDTVs in the studio.",
  "Events run from smaller birthday gatherings to corporate groups of 50 or more.",
  "Event hosting includes a golf pro for mini-lessons, the simulators, and casual games.",
  "Packages are worked out around the request. The site does not publish a price list.",
] as const;

export const HOLIDAY_FACTS = [
  "The holiday page invites groups of 6 to 40, in a bay or across the venue.",
  "Food can be catered or brought in. Beers and wines are welcome; it is BYOB.",
  "Listed perks include 2 or 3 hours, reserved bays, SONOS music, complimentary clubs, and a karaoke system on the TVs.",
  "Each bay holds up to 6 guests. The events phone number is (732) 448-2769.",
] as const;
