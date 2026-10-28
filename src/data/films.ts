import { PHOTOS, type PhotoAsset } from "./photos";

/**
 * Testimonial films for the membership background.
 * Leave `src` empty until the MP4 arrives, then set it to a path under public/
 * (for example "media/testimonials/bay.mp4"). The poster stays up until then.
 */
export type TestimonialFilm = {
  id: string;
  src: string;
  poster: PhotoAsset;
  quote?: string;
  name?: string;
};

export const TESTIMONIAL_FILMS: readonly TestimonialFilm[] = [
  {
    id: "bays",
    src: "",
    poster: PHOTOS.bays,
    quote: "Great place, great staff, amazing owners.",
    name: "Tristan",
  },
  {
    id: "lesson",
    src: "",
    poster: PHOTOS.gripLesson,
    quote: "Thank you Nick for the best coaching experience and for helping me improve so much.",
    name: "Jeric",
  },
  {
    id: "group",
    src: "",
    poster: PHOTOS.groupWave,
    quote: "Had an amazing time at Par2Play.",
    name: "Kenssy",
  },
];

/**
 * Coaching film. Set `src` to the MP4 when it is delivered.
 * The poster is the still that used to fill this frame.
 */
export const COACHING_FILM = {
  src: "",
  poster: PHOTOS.coachAndPlayer,
} as const;
