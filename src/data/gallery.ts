import { PHOTOS } from "./photos";

const file = (path: string) => `${import.meta.env.BASE_URL}media/${path}`;

export type TickerChip = {
  id: string;
  label: string;
  webp: string;
  jpg: string;
};

/** Square chips from the photo set, plus the existing stills where this set has no match. */
export const TICKER_CHIPS: readonly TickerChip[] = [
  {
    id: "indoor",
    label: "Year-round indoor golf",
    webp: file("ticker/indoor-golf.webp"),
    jpg: file("ticker/indoor-golf.jpg"),
  },
  {
    id: "data",
    label: "Tour-grade launch monitor data",
    webp: file("ticker/launch-monitor.webp"),
    jpg: file("ticker/launch-monitor.jpg"),
  },
  {
    id: "membership",
    label: "Unlimited membership",
    webp: file("ticker/regulars.webp"),
    jpg: file("ticker/regulars.jpg"),
  },
  {
    id: "community",
    label: "Community",
    webp: file("ticker/community.webp"),
    jpg: file("ticker/community.jpg"),
  },
  {
    id: "clubhouse",
    label: "The clubhouse",
    webp: file("ticker/clubhouse.webp"),
    jpg: file("ticker/clubhouse.jpg"),
  },
  {
    id: "groups",
    label: "Groups and corporate events",
    webp: file("ticker/groups.webp"),
    jpg: file("ticker/groups.jpg"),
  },
  {
    id: "coaches",
    label: "Two PGA professional coaches",
    webp: PHOTOS.coachAndPlayer.webp,
    jpg: PHOTOS.coachAndPlayer.jpg,
  },
  {
    id: "fitting",
    label: "Club fitting",
    webp: PHOTOS.clubRack.webp,
    jpg: PHOTOS.clubRack.jpg,
  },
  {
    id: "juniors",
    label: "Junior coaching",
    webp: PHOTOS.juniorGroup.webp,
    jpg: PHOTOS.juniorGroup.jpg,
  },
  {
    id: "events",
    label: "Leagues and events",
    webp: file("events/event-5-800.webp"),
    jpg: file("events/event-5.webp"),
  },
];

export type GalleryPhoto = {
  id: string;
  alt: string;
  src800: string;
  src1600: string;
  width: number;
  height: number;
};

export const EVENT_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "event-2",
    alt: "Catered dessert table with cookies, pastries and brownies on tiered stands",
    src800: file("events/event-2-800.webp"),
    src1600: file("events/event-2.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "event-3",
    alt: "Drinks station with bottles of wine on ice and rows of glasses",
    src800: file("events/event-3-800.webp"),
    src1600: file("events/event-3.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "event-4",
    alt: "Buffet table of baked goods and sweets with holiday decorations",
    src800: file("events/event-4-800.webp"),
    src1600: file("events/event-4.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "event-5",
    alt: "Two men laughing during birthday karaoke, one singing into a microphone",
    src800: file("events/event-5-800.webp"),
    src1600: file("events/event-5.webp"),
    width: 1600,
    height: 1164,
  },
  {
    id: "event-6",
    alt: "Couple smiling in front of the illuminated Par2Play sign at a holiday event",
    src800: file("events/event-6-800.webp"),
    src1600: file("events/event-6.webp"),
    width: 1600,
    height: 1067,
  },
];

export const EVENT_HERO = EVENT_GALLERY[4];

/** community-8 is omitted. The frame is weak and is not shown. */
export const COMMUNITY_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "community-1",
    alt: "Two smiling men in the lounge, one giving a thumbs up",
    src800: file("community/community-1-800.webp"),
    src1600: file("community/community-1.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-2",
    alt: "Three women hugging and smiling on a lounge sofa",
    src800: file("community/community-2-800.webp"),
    src1600: file("community/community-2.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-3",
    alt: "Three men posing arm in arm and smiling at an evening gathering",
    src800: file("community/community-3-800.webp"),
    src1600: file("community/community-3.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-4",
    alt: "Three friends posing together and smiling at a party",
    src800: file("community/community-4-800.webp"),
    src1600: file("community/community-4.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-5",
    alt: "Man and woman posing together and smiling in the lounge",
    src800: file("community/community-5-800.webp"),
    src1600: file("community/community-5.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-6",
    alt: "Three guests smiling and raising drinks in the lounge",
    src800: file("community/community-6-800.webp"),
    src1600: file("community/community-6.webp"),
    width: 1600,
    height: 1067,
  },
  {
    id: "community-7",
    alt: "Group relaxing on lounge sofas and chatting",
    src800: file("community/community-7-800.webp"),
    src1600: file("community/community-7.webp"),
    width: 1600,
    height: 1067,
  },
];
