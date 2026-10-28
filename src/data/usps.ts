import type { PhotoAsset } from "./photos";
import { PHOTOS } from "./photos";

/** Edit this list to change the ticker. Chips use photos already on the site. */
export type UspItem = {
  id: string;
  label: string;
  photo: PhotoAsset;
};

export const USP_ITEMS: readonly UspItem[] = [
  { id: "coaches", label: "Two PGA professional coaches", photo: PHOTOS.coachAndPlayer },
  { id: "indoor", label: "Year-round indoor golf", photo: PHOTOS.bays },
  { id: "data", label: "Tour-grade launch monitor data", photo: PHOTOS.launchData },
  { id: "membership", label: "Unlimited membership", photo: PHOTOS.range },
  { id: "fitting", label: "Club fitting", photo: PHOTOS.clubRack },
  { id: "juniors", label: "Junior coaching", photo: PHOTOS.juniorGroup },
  { id: "events", label: "Leagues and events", photo: PHOTOS.holidayLounge },
];
