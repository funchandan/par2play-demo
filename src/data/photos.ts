const media = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export type PhotoAsset = {
  id: string;
  alt: string;
  jpg: string;
  webp: string;
  avif: string;
  width: number;
  height: number;
};

function photo(id: string, alt: string, width: number, height: number): PhotoAsset {
  return {
    id,
    alt,
    jpg: media(`photos/${id}.jpg`),
    webp: media(`photos/${id}.webp`),
    avif: media(`photos/${id}.avif`),
    width,
    height,
  };
}

/**
 * Real event-shoot stills, resized to 1600px on the long edge.
 * Source folders: venue/, community/, junior-coaching/.
 * Coaches are not named on captions — the footage has not been matched to Nick or Sean.
 */
export const PHOTOS = {
  bays: photo(
    "bays",
    "Several simulator bays in use at once, with players and the Par2Play logo on the wall.",
    1600,
    900,
  ),
  lounge: photo(
    "lounge",
    "The Par2Play lounge, with grey sectionals, a wall-mounted screen, and square ceiling lights.",
    1600,
    900,
  ),
  storefront: photo(
    "storefront",
    "The Par2Play storefront at dusk, glass front and green sign above the door, snow on the ground.",
    1600,
    900,
  ),
  logoWall: photo(
    "logo-wall",
    "The lit Par2Play wordmark on a dark green wall beside a simulator screen.",
    1600,
    900,
  ),
  clubRack: photo(
    "club-rack",
    "Golf bags and clubs stored on a wooden rack inside Par2Play.",
    1600,
    900,
  ),
  range: photo(
    "range",
    "Players hitting into the nets at Par2Play, with the logo on the far wall.",
    1600,
    900,
  ),
  holidayLounge: photo(
    "holiday-lounge",
    "The Par2Play lounge dressed for a holiday party, with a tree, string lights, and a PAR 2 PLAY backdrop.",
    1600,
    1067,
  ),
  groupWave: photo(
    "group-wave",
    "A group of players and coaches posing and waving in front of a Par2Play simulator.",
    1600,
    900,
  ),
  birthdayGroup: photo(
    "birthday-group",
    "Guests at a birthday gathering in the Par2Play lounge, seated around a table.",
    1600,
    1067,
  ),
  coachAndPlayer: photo(
    "coach-and-player",
    "A coach in a Par2Play jacket with his arm around a player, both smiling in front of the simulator.",
    1600,
    900,
  ),
  gripLesson: photo(
    "grip-lesson",
    "A coach kneels to set a junior golfer's hands on the club during a lesson.",
    1600,
    900,
  ),
  launchData: photo(
    "launch-data",
    "A coach and a junior golfer look at launch-monitor numbers on the simulator screen.",
    1600,
    900,
  ),
  juniorSetup: photo(
    "junior-setup",
    "A coach places a ball and sets a young golfer's stance in a Par2Play bay.",
    1600,
    900,
  ),
  juniorGroup: photo(
    "junior-group",
    "A line of junior golfers with two coaches in front of a Par2Play simulator.",
    1600,
    900,
  ),
  juniorScreen: photo(
    "junior-screen",
    "Two junior golfers and an adult review the simulator touchscreen.",
    1600,
    900,
  ),
  ladiesClinic: photo(
    "ladies-clinic",
    "A coach demonstrates a swing for two players during a ladies' clinic at Par2Play.",
    1600,
    1067,
  ),
} as const;

export type PhotoId = keyof typeof PHOTOS;
