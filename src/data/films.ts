import { PHOTOS } from "./photos";

const media = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/**
 * Client testimonial films for the membership background.
 * Desktop files are 1280×720. Mobile files are 720×406.
 * Order is the clearest thumbs-up first, then the third clip, then the second.
 */
export type TestimonialFilm = {
  id: string;
  src: string;
  srcMobile: string;
  poster: string;
};

export const TESTIMONIAL_FILMS: readonly TestimonialFilm[] = [
  {
    id: "testimonial-1",
    src: media("media/testimonials/testimonial-1.mp4"),
    srcMobile: media("media/testimonials/testimonial-1-mobile.mp4"),
    poster: media("media/testimonials/testimonial-1.jpg"),
  },
  {
    id: "testimonial-3",
    src: media("media/testimonials/testimonial-3.mp4"),
    srcMobile: media("media/testimonials/testimonial-3-mobile.mp4"),
    poster: media("media/testimonials/testimonial-3.jpg"),
  },
  {
    id: "testimonial-2",
    src: media("media/testimonials/testimonial-2.mp4"),
    srcMobile: media("media/testimonials/testimonial-2-mobile.mp4"),
    poster: media("media/testimonials/testimonial-2.jpg"),
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
